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
import { Stock } from "./model/Stock";
import { StockService } from "./services/stock.service";
import { IDropdownSettings, NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { LookUp } from "app/core/models/LookUp";
import { AlertifyService } from "app/core/services/alertify.service";
import { LookUpService } from "app/core/services/LookUp.service";
import { MustMatch } from "app/core/directives/must-match";
import { environment } from "environments/environment";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { AuthService } from "app/core/components/admin/login/services/auth.service";
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
import { StockAddDialogComponent } from "./dialog/stock-add-dialog/stock-add-dialog.component";
import { StockUpdateDialogComponent } from "./dialog/stock-update-dialog/stock-update-dialog.component";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {MatDividerModule} from '@angular/material/divider';
import { MatIconModule } from "@angular/material/icon";
import { get } from "jquery";



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

  templateUrl: "./stock.component.html",
  styleUrls: ["./stock.component.css"],
})
export class StockComponent implements AfterViewInit, OnInit {
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [
    "stockId",
    "productName",
    "quantity",
    "readyForSale",
    "isDeleted",
    "approve",
    "edit",
    "delete"
  ];

  stock: Stock = new Stock();
  stockList: Stock[] = [];
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
    private stockService : StockService,
    private formBuilder: FormBuilder,
    private alertifyService: AlertifyService,
    private lookUpService: LookUpService,
    private authService: AuthService,
    public dialog: MatDialog
  ) {}

  StockAddDialog(): void {
    const dialogRef = this.dialog.open(StockAddDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getStockList();
    });
  }

  StockUpdateDialog(element: Stock): void {
    const dialogRef = this.dialog.open(StockUpdateDialogComponent, {
      width: '500px',
      data: { id: element.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getStockList();
    });
  }



  ngAfterViewInit(): void {
    this.getStockList();
  }

  stockAddForm: FormGroup;

  ngOnInit(): void {


    this.dropdownSettings = environment.getDropDownSetting;

    this.lookUpService.getGroupLookUp().subscribe((data) => {
      this.groupDropdownList = data;
    });

    this.lookUpService.getOperationClaimLookUp().subscribe((data) => {
      this.claimDropdownList = data;
    });
  }


  getStockList() {
    this.stockService.getStockList().subscribe(
      (data) => {
        this.stockList = data;
        this.dataSource = new MatTableDataSource(data);
        this.configDataTable();

        this.dataSource.data.forEach((stock) => {
          console.log("Stock:", stock); // Kullanıcı verilerini kontrol etmek için
          console.log("is deleted?",stock.isDeleted)
        });
      },
      (error) => {
        console.error("Error fetching stock list:", error);
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


  save() {
    if (this.stockAddForm.valid) {
        console.log('Form submitted', this.stockAddForm.value);
        this.stock = Object.assign({}, this.stockAddForm.value);

        if (this.stock.id == 0) this.addStock();
        else this.updateStock();
    }
    else {
        console.log('Form is invalid');
        console.log(this.stockAddForm.controls);  // Kontrol edilecek alanlar
        for (const control in this.stockAddForm.controls) {
            if (this.stockAddForm.controls[control].errors) {
                console.log(`Error in ${control}:`, this.stockAddForm.controls[control].errors);
            }
        }
    }
  }

  addStock() {
    this.stockService.addStock(this.stock).subscribe((data) => {
      this.getStockList();
      this.stock = new Stock();
      this.alertifyService.success(data);
      this.clearFormGroup(this.stockAddForm);
    }, error => {
      console.error('Error adding stock:', error);
    });
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
      var index = this.stockList.findIndex(
        (x) => x.id == this.stock.id
      );
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
    this.stockService.deleteStock(id).subscribe((data) => {
      this.alertifyService.success(data.toString());
      var index = this.stockList.findIndex((x) => x.id == id);
      this.stockList[index].isDeleted = false;
      this.dataSource = new MatTableDataSource(this.stockList);
      this.configDataTable();
    });
  }

  confirmForSale(id: number) {
    const stock = this.stockList.find(x => x.id === id);
    const updatedStock = { ...stock, IsReadyForSale: true };

    this.stockService.updateStock(updatedStock).subscribe(
      (data) => {
        this.alertifyService.success('Stock confirmed for sale');
        this.getStockList();
      },
      (error) => {
        this.alertifyService.error('Error confirming stock for sale');
      }
    );
  }

  rejectForSale(id: number) {
    const stock = this.stockList.find(x => x.id === id);
    const updatedStock = { ...stock, IsReadyForSale: false };

    this.stockService.updateStock(updatedStock).subscribe(
      (data) => {
        this.alertifyService.warning('Stock rejected for sale');
        this.getStockList();
      },
      (error) => {
        this.alertifyService.error('Error rejecting stock for sale');
      }
    );
  }

}