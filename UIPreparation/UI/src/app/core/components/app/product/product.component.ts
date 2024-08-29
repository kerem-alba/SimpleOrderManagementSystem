import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Product } from "./models/Product";
import { ProductService } from "./services/product.service";
import { Color } from ".././color/model/Color";
import { ColorService } from ".././color/service/color.service";
import { AlertifyService } from "app/core/services/alertify.service";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { AuthService } from "../../admin/login/services/auth.service";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { CommonModule } from "@angular/common";
import { MatRippleModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatTooltipModule } from "@angular/material/tooltip";
import { TranslateModule } from "@ngx-translate/core";
import { Size } from "./models/size.enum";
import { ProductAddDialogComponent } from "./dialog/product-add-dialog/product-add-dialog.component";
import { ProductUpdateDialogComponent } from "./dialog/product-update-dialog/product-update-dialog.component";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "product",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    SweetAlert2Module,
    MatRippleModule,
    MatSelectModule,
    MatTooltipModule,
    TranslateModule,
    MatDialogModule,
    MatGridListModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    MatIconModule,
  ],

  templateUrl: "./product.component.html",
  styleUrls: ["./product.component.scss"],
})
export class ProductComponent implements AfterViewInit, OnInit {
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ["id", "name", "colorId", "size", "update", "delete"];

  product: Product = new Product();
  productList: Product[] = [];
  colorList: Color[] = [];
  colorCodesMap: { [key: number]: string } = {};
  colorNamesMap: { [key: number]: string } = {};
  colorCodesList: string[] = [];
  uniqueProductNames: string[] = [];

  id: number;
  Filter: string = "";

  constructor(
    private productService: ProductService,
    private colorService: ColorService,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    public dialog: MatDialog
  ) {}

  ProductAddDialog(): void {
    const dialogRef = this.dialog.open(ProductAddDialogComponent, {
      width: "500px",
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getProductList();
    });
  }

  ProductUpdateDialog(productId: number): void {
    const dialogRef = this.dialog.open(ProductUpdateDialogComponent, {
      data: { id: productId },
      width: "500px",
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getProductList();
    });
  }

  ngAfterViewInit(): void {
    this.getProductList();
  }

  productAddForm: FormGroup;
  sizeOptions = [
    { label: "Small", value: Size.S },
    { label: "Medium", value: Size.M },
    { label: "Large", value: Size.L },
    { label: "Extra Large", value: Size.XL },
  ];

  ngOnInit(): void {
    this.getColorCodes();
    this.getColorNames();
  }

  getProductList() {
    this.productService.getProductList().subscribe(
      (data) => {
        const sortedData = data
          .filter((x) => !x.isDeleted)
          .sort((a, b) => a.name.localeCompare(b.name));
        this.productList = sortedData;
        this.dataSource = new MatTableDataSource(sortedData);
        this.configDataTable();

        this.uniqueProductNames = Array.from(new Set(sortedData.map((item) => item.name)));
        console.log(this.uniqueProductNames);
      },
      (error) => {
        this.alertifyService.error("Error getting product list.");
      }
    );
  }

  getColorCodes() {
    this.colorService.getAll().subscribe((data) => {
      data.forEach((color) => {
        this.colorCodesMap[color.id] = color.code;
      });
    });
  }

  getColorNames() {
    this.colorService.getAll().subscribe((data) => {
      data.forEach((color) => {
        this.colorNamesMap[color.id] = color.name;
      });
    });
  }

  clearFormGroup(group: FormGroup) {
    group.markAsUntouched();
    group.reset();
    Object.keys(group.controls).forEach((key) => {
      group.get(key).setErrors(null);
      if (key === "id") group.get(key).setValue(0);
      else if (key === "status") group.get(key).setValue(true);
    });
  }

  save() {
    if (this.productAddForm.valid) {
      this.product = this.productAddForm.value;

      if (this.product.id == 0) this.addProduct();
      else this.updateProduct();
    } else {
      this.alertifyService.error("Error adding product. Please check the form and try again.");
    }
  }

  addProduct() {
    this.productService.addProduct(this.product).subscribe(
      (data) => {
        this.getProductList();
        this.product = new Product();
        this.alertifyService.success(data);
        this.clearFormGroup(this.productAddForm);
      },
      (error) => {
        this.alertifyService.error("Error adding product.");
      }
    );
  }

  getProductById(id: number) {
    this.clearFormGroup(this.productAddForm);
    this.productService.getProductById(id).subscribe((data) => {
      this.product = data;
      this.productAddForm.patchValue(data);
    });
  }

  updateProduct() {
    this.productService.updateProduct(this.product).subscribe((data) => {
      this.dataSource = new MatTableDataSource(this.productList);
      this.configDataTable();
      this.alertifyService.success(data);
      this.clearFormGroup(this.productAddForm);
    });
  }

  deleteProduct(id: number) {
    this.productService.deleteProduct(id).subscribe((data) => {
      this.alertifyService.success(data.toString());
      this.getProductList();
    });
  }

  filterProductsByName(name: string) {
    const filteredProducts = this.productList.filter((product) => product.name === name);
    this.dataSource = new MatTableDataSource(filteredProducts);
    this.configDataTable();
  }
  showAllProducts() {
    this.dataSource = new MatTableDataSource(this.productList);
    this.configDataTable();
  }

  checkClaim(claim: string): boolean {
    return this.authService.claimGuard(claim);
  }

  configDataTable(): void {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
