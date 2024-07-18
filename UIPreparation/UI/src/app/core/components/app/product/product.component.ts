import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Product } from "./models/Product";
import { ProductService } from "./services/product.service";
import { IDropdownSettings, NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { LookUp } from "app/core/models/LookUp";
import { AlertifyService } from "app/core/services/alertify.service";
import { LookUpService } from "app/core/services/LookUp.service";
import { MustMatch } from "app/core/directives/must-match";
import { environment } from "environments/environment";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { AuthService } from "../../admin/login/services/auth.service";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import {
  MatFormField,
  MatFormFieldModule,
  MatLabel,
} from "@angular/material/form-field";
import { MatButtonModule, MatIconButton } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { CommonModule } from "@angular/common";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatTooltipModule } from "@angular/material/tooltip";
import { TranslateModule } from "@ngx-translate/core";
import { Size } from "./models/size.enum";
import { ProductAddDialogComponent } from "./dialog/product-add-dialog/product-add-dialog.component";
import { ProductUpdateDialogComponent } from "./dialog/product-update-dialog/product-update-dialog.component";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {MatDividerModule} from '@angular/material/divider';
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
    MatCheckboxModule,
    NgMultiSelectDropDownModule,
    SweetAlert2Module,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    TranslateModule,
    MatDialogModule,
    MatIconButton,
    MatSortModule,
    MatTableModule,
    MatGridListModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    MatIconModule
  ],

        

  providers: [SweetAlert2Module.forRoot().providers],

  templateUrl: "./product.component.html",
  styleUrls: ["./product.component.scss"],
})
export class ProductComponent implements AfterViewInit, OnInit {
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [
    "id",
    "name",
    "colorId",
    "status",
    "size",
    "update",
    "delete",
  ];

  product: Product = new Product();
  productList: Product[] = [];
  groupDropdownList: LookUp[];
  groupSelectedItems: LookUp[];
  dropdownSettings: IDropdownSettings;

  claimDropdownList: LookUp[];
  claimSelectedItems: LookUp[];

  isGroupChange: boolean = false;
  isClaimChange: boolean = false;

  id: number;
  Filter: string = "";

  constructor(
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private alertifyService: AlertifyService,
    private lookUpService: LookUpService,
    private authService: AuthService,
    public dialog: MatDialog
  ) {}

  ProductAddDialog(): void {
    const dialogRef = this.dialog.open(ProductAddDialogComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getProductList(); // Listesi güncelle
    });
  }

  ProductUpdateDialog(productId: number): void {
    const dialogRef = this.dialog.open(ProductUpdateDialogComponent, {
      data: { id: productId },
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getProductList(); // Listesi güncelle
    });
  }

  ngAfterViewInit(): void {
    this.getProductList();
  }

  productAddForm: FormGroup;
  sizeOptions = [
    { label: 'Small', value: Size.S },
    { label: 'Medium', value: Size.M },
    { label: 'Large', value: Size.L },
    { label: 'Extra Large', value: Size.XL }
  ];

  ngOnInit(): void {
    this.createProductAddForm();

    this.dropdownSettings = environment.getDropDownSetting;

    this.lookUpService.getGroupLookUp().subscribe((data) => {
      this.groupDropdownList = data;
    });

    this.lookUpService.getOperationClaimLookUp().subscribe((data) => {
      this.claimDropdownList = data;
    });
  }

  createProductAddForm() {
    this.productAddForm = this.formBuilder.group({
      id: [0],
      name: ["", Validators.required],
      size: [null, Validators.required],
      colorId: ["", Validators.required], 
      status: [true],
    });
  }

  getProductList() {
    this.productService.getProductList().subscribe(
      (data) => {
        this.productList = data;
        this.dataSource = new MatTableDataSource(data);
        this.configDataTable();

        // Verinin doğru formatta olduğundan emin olun
        this.dataSource.data.forEach((product) => {
          console.log("Product:", product); // Kullanıcı verilerini kontrol etmek için
          console.log("Type of status:", typeof product.status); // status alanının türünü kontrol etmek için
        });
      },
      (error) => {
        console.error("Error fetching product list:", error);
      }
    );
  }

  clearFormGroup(group: FormGroup) {
    group.markAsUntouched();
    group.reset();
    Object.keys(group.controls).forEach((key) => {
      group.get(key).setErrors(null);
      if (key === "id") group.get(key).setValue(0);
      else if (key === "status") group.get(key).setValue(true);
    });
    console.log(group.controls); // Form kontrollerinin sıfırlanmış hallerini kontrol etmek için
  }

  setProductId(id: number) {
    this.id = id;
  }

  save() {
    if (this.productAddForm.valid) {
        console.log('Form submitted', this.productAddForm.value);
        this.product = Object.assign({}, this.productAddForm.value);

        if (this.product.id == 0) this.addProduct();
        else this.updateProduct();
    }
    else {
        console.log('Form is invalid');
        console.log(this.productAddForm.controls);  // Kontrol edilecek alanlar
        for (const control in this.productAddForm.controls) {
            if (this.productAddForm.controls[control].errors) {
                console.log(`Error in ${control}:`, this.productAddForm.controls[control].errors);
            }
        }
    }
  }

  addProduct() {
    this.productService.addProduct(this.product).subscribe((data) => {
      this.getProductList();
      this.product = new Product();
      this.alertifyService.success(data);
      this.clearFormGroup(this.productAddForm);
    }, error => {
      console.error('Error adding product:', error);
    });
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
      var index = this.productList.findIndex(
        (x) => x.id == this.product.id
      );
      this.productList[index] = this.product;
      this.dataSource = new MatTableDataSource(this.productList);
      this.configDataTable();
      this.product = new Product();
      this.alertifyService.success(data);
      this.clearFormGroup(this.productAddForm);
    });
  }

  deleteProduct(id: number) {
    this.productService.deleteProduct(id).subscribe((data) => {
      this.alertifyService.success(data.toString());
      var index = this.productList.findIndex((x) => x.id == id);
      this.productList[index].status = false;
      this.dataSource = new MatTableDataSource(this.productList);
      this.configDataTable();
    });
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