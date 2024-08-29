import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Stock } from "./model/Stock";
import { StockService } from "./services/stock.service";
import { AlertifyService } from "app/core/services/alertify.service";
import { LookUpService } from "app/core/services/LookUp.service";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { AuthService } from "app/core/components/admin/login/services/auth.service";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatButtonModule, MatIconButton } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { CommonModule } from "@angular/common";
import { MatRippleModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatTooltipModule } from "@angular/material/tooltip";
import { TranslateModule } from "@ngx-translate/core";
import { StockAddDialogComponent } from "./dialog/stock-add-dialog/stock-add-dialog.component";
import { StockUpdateDialogComponent } from "./dialog/stock-update-dialog/stock-update-dialog.component";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "stock",
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
    MatIconModule,
  ],

  providers: [SweetAlert2Module.forRoot().providers],

  templateUrl: "./stock.component.html",
  styleUrls: ["./stock.component.css"],
})
export class StockComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [
    "stockId",
    "productName",
    "productSize",
    "productColor",
    "quantity",
    "readyForSale",
    "approve",
    "edit",
    "delete",
  ];

  stock: Stock = new Stock();
  stockList: Stock[] = [];

  id: number;
  Filter: string = "";

  constructor(
    private stockService: StockService,
    private formBuilder: FormBuilder,
    private alertifyService: AlertifyService,
    private lookUpService: LookUpService,
    private authService: AuthService,
    public dialog: MatDialog
  ) {}

  StockAddDialog(): void {
    const dialogRef = this.dialog.open(StockAddDialogComponent, {
      width: "500px",
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getStockList();
    });
  }

  StockUpdateDialog(element: Stock): void {
    const dialogRef = this.dialog.open(StockUpdateDialogComponent, {
      width: "500px",
      data: { id: element.id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getStockList();
    });
  }

  stockAddForm: FormGroup;

  ngOnInit(): void {
    this.getStockList();
  }

  getStockList() {
    this.stockService.getStockList().subscribe(
      (data) => {
        const filteredData = data.filter((x) => x.isDeleted == false);
        this.stockList = filteredData;
        console.log("Stock List:", this.stockList);
        this.dataSource = new MatTableDataSource(filteredData);
        this.configDataTable();
      },
      (error) => {
        console.error("Error fetching stock list:", error);
      }
    );
  }

  clearFormGroup(group: FormGroup) {
    group.reset({
      id: 0,
      status: true,
    });
  }

  save() {
    if (this.stockAddForm.valid) {
      console.log("Form submitted", this.stockAddForm.value);
      this.stock = Object.assign({}, this.stockAddForm.value);

      if (this.stock.id == 0) this.addStock();
      else this.updateStock();
    } else {
      for (const control in this.stockAddForm.controls) {
        if (this.stockAddForm.controls[control].errors) {
          console.log(`Error in ${control}:`, this.stockAddForm.controls[control].errors);
        }
      }
    }
  }

  addStock() {
    this.stockService.addStock(this.stock).subscribe(
      (data) => {
        this.getStockList();
        this.stock = new Stock();
        this.alertifyService.success(data);
        this.clearFormGroup(this.stockAddForm);
      },
      (error) => {
        console.error("Error adding stock:", error);
      }
    );
  }

  getStockById(id: number) {
    this.clearFormGroup(this.stockAddForm);
    this.stockService.getStockById(id).subscribe((data) => {
      this.stock = data;
      this.stockAddForm.patchValue(data);
    });
  }

  updateStock() {
    this.stockService.updateStock(this.stock).subscribe((data) => {
      var index = this.stockList.findIndex((x) => x.id == this.stock.id);
      this.stockList[index] = this.stock;
      this.dataSource = new MatTableDataSource(this.stockList);
      this.configDataTable();
      this.stock = new Stock();
      this.alertifyService.success(data);
      this.clearFormGroup(this.stockAddForm);
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

  deleteStock(id: number) {
    this.stockService.deleteStock(id).subscribe(
      (data) => {
        this.alertifyService.success("Stock deleted successfully.");
        this.stockList = this.stockList.filter((x) => x.id !== id);
        this.dataSource = new MatTableDataSource(this.stockList);
        this.configDataTable();
      },
      (error) => {
        this.alertifyService.error("An error occurred while deleting the stock.");
      }
    );
  }

  confirmForSale(id: number) {
    const stock = this.stockList.find((x) => x.id === id);
    const updatedStock = { ...stock, IsReadyForSale: true };

    this.stockService.updateStock(updatedStock).subscribe(
      (data) => {
        this.alertifyService.success("Stock confirmed for sale");
        this.getStockList();
      },
      (error) => {
        this.alertifyService.error("Error confirming stock for sale");
      }
    );
  }

  rejectForSale(id: number) {
    const stock = this.stockList.find((x) => x.id === id);
    const updatedStock = { ...stock, IsReadyForSale: false };

    this.stockService.updateStock(updatedStock).subscribe(
      (data) => {
        this.alertifyService.warning("Stock rejected for sale");
        this.getStockList();
      },
      (error) => {
        this.alertifyService.error("Error rejecting stock for sale");
      }
    );
  }
}
