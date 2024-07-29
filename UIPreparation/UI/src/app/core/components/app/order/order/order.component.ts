import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Order } from "../model/Order";
import { StatusEnum } from "../model/StatusEnum.enum";
import { OrderService } from "../services/order.service";
import { StockService } from "../../stock/services/stock.service";
import {
  IDropdownSettings,
  NgMultiSelectDropDownModule,
} from "ng-multiselect-dropdown";
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
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatRippleModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatTooltipModule } from "@angular/material/tooltip";
import { TranslateModule } from "@ngx-translate/core";
import { OrderAddDialogComponent } from "../dialog/order-add-dialog/order-add-dialog.component";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "order",
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
    MatIconModule,
  ],

  providers: [SweetAlert2Module.forRoot().providers],

  templateUrl: "./order.component.html",
  styleUrls: ["./order.component.css"],
})
export class OrderComponent implements AfterViewInit, OnInit {
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [
    "orderId",
    "customerName",
    "productName",
    "quantity",
    "orderStatus",
    "actions",
  ];

  order: Order = new Order();
  orderList: Order[] = [];
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
    private orderService: OrderService,
    private formBuilder: FormBuilder,
    private alertifyService: AlertifyService,
    private lookUpService: LookUpService,
    private authService: AuthService,
    private stockService: StockService,
    public dialog: MatDialog
  ) {}

  OrderAddDialog(): void {
    const dialogRef = this.dialog.open(OrderAddDialogComponent, {
      width: "500px",
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getOrderList(); // Listesi güncelle
    });
  }

  ngAfterViewInit(): void {
    this.getOrderList();
  }

  orderAddForm: FormGroup;

  ngOnInit(): void {
    this.createOrderAddForm();

    this.dropdownSettings = environment.getDropDownSetting;

    this.lookUpService.getGroupLookUp().subscribe((data) => {
      this.groupDropdownList = data;
    });

    this.lookUpService.getOperationClaimLookUp().subscribe((data) => {
      this.claimDropdownList = data;
    });
  }

  createOrderAddForm() {
    this.orderAddForm = this.formBuilder.group({
      id: [0],
      customerId: ["", Validators.required],
      productId: ["", Validators.required],
      quantity: ["", Validators.required],
      status: [false],
    });
  }

  getOrderList() {
    this.orderService.getOrderList().subscribe(
      (data) => {
        this.orderList = data;
        this.dataSource = new MatTableDataSource(data);
        this.configDataTable();

        // Verinin doğru formatta olduğundan emin olun
        this.dataSource.data.forEach((order) => {
          console.log("Order:", order); // Kullanıcı verilerini kontrol etmek için
        });
      },
      (error) => {
        console.error("Error fetching order list:", error);
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

  setOrderId(id: number) {
    this.id = id;
  }

  getOrderById(id: number) {
    this.clearFormGroup(this.orderAddForm);
    this.orderService.getOrderById(id).subscribe((data) => {
      this.order = data;
      this.orderAddForm.patchValue(data);
    });
  }

  updateOrderStatus(id: number, status: StatusEnum) {
    const order = this.orderList.find((x) => x.id === id);
    const updatedOrder = { ...order, orderStatus: status };

    this.orderService.updateOrder(updatedOrder).subscribe(
      (data) => {
        var index = this.orderList.findIndex((x) => x.id == updatedOrder.id);
        this.orderList[index] = updatedOrder;
        this.dataSource = new MatTableDataSource(this.orderList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.alertifyService.success(
          `Order ${StatusEnum[status].toLowerCase()} successfully`
        );
      },
      (error) => {
        console.error("Error response:", error); // Hata mesajını detaylı olarak yazdırın
        this.alertifyService.error(
          `Error ${StatusEnum[status].toLowerCase()} order`
        );
      }
    );
  }

  approveOrder(id: number) {
    const order = this.orderList.find((x) => x.id === id);
    console.log("Order:", order);
    this.stockService.getStockList().subscribe(
      (stocks) => {
        const stock = stocks.find((s) => s.productId === order.productId);
        if (!stock || stock.isDeleted) {
          this.alertifyService.error("No stock for this product");
          return;
        }
        console.log("Stock:", stock, "Order:", order);
        if (stock.isReadyForSale === false) {
          this.alertifyService.error("Stock is not ready for sale.");
          return;
        }
        if (stock.quantity >= order.quantity) {
          this.stockService.updateStock(stock).subscribe(
            () => {
              this.updateOrderStatus(id, StatusEnum.Approved);
              this.alertifyService.success("Sufficient stocks.");
            },
            (error) => {
              this.alertifyService.error("Error updating stock.");
            }
          );
        } else {
          this.alertifyService.error("Not enough stock to approve this order.");
        }
      },
      (error) => {
        console.error("Error fetching stock list:", error);
        this.alertifyService.error("Error fetching stock information");
      }
    );
  }

  rejectOrder(id: number) {
    this.updateOrderStatus(id, StatusEnum.Rejected);
  }

  cancelOrder(id: number) {
    this.updateOrderStatus(id, StatusEnum.Cancelled);
  }
  getStatusText(status: StatusEnum): string {
    return StatusEnum[status];
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
