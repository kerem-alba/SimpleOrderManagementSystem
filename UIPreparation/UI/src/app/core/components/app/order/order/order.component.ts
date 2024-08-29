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
import { AlertifyService } from "app/core/services/alertify.service";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { AuthService } from "app/core/components/admin/login/services/auth.service";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule, MatIconButton } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { CommonModule } from "@angular/common";
import { MatRippleModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatTooltipModule } from "@angular/material/tooltip";
import { TranslateModule } from "@ngx-translate/core";
import { OrderAddDialogComponent } from "../dialog/order-add-dialog/order-add-dialog.component";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { data } from "jquery";

@Component({
  selector: "order",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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
    MatDividerModule,
    MatIconModule,
  ],

  providers: [SweetAlert2Module.forRoot().providers],

  templateUrl: "./order.component.html",
  styleUrls: ["./order.component.css"],
})
export class OrderComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [
    "orderId",
    "customerName",
    "productName",
    "productSize",
    "productColor",
    "quantity",
    "orderStatus",
    "actions",
  ];

  order: Order = new Order();
  orderList: Order[] = [];

  Filter: string = "";

  constructor(
    private orderService: OrderService,
    private formBuilder: FormBuilder,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private stockService: StockService,
    public dialog: MatDialog
  ) {}

  OrderAddDialog(): void {
    const dialogRef = this.dialog.open(OrderAddDialogComponent, {
      width: "500px",
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getOrderList();
    });
  }

  orderAddForm: FormGroup;

  ngOnInit(): void {
    this.getOrderList();
  }

  createOrderAddForm() {
    this.orderAddForm = this.formBuilder.group({
      id: [0],
      customerId: ["", Validators.required],
      productId: ["", Validators.required],
      quantity: ["", Validators.required],
      isDeleted: [false],
    });
  }

  getOrderList() {
    this.orderService.getOrderList().subscribe(
      (data) => {
        this.orderList = data.filter((x) => x.isDeleted === false);
        this.dataSource = new MatTableDataSource(this.orderList);
        this.configDataTable();
        console.log("Order List:", this.orderList);
      },
      (error) => {
        console.error("Error fetching order list:", error);
      }
    );
  }

  clearFormGroup(group: FormGroup) {
    group.reset({
      id: 0,
      status: true,
    });
  }

  updateOrderStatus(id: number, OrderStatus: string) {
    this.orderService.getOrderById(id).subscribe((order) => {
      if (OrderStatus === "Approved") {
        this.stockService
          .getStockQuantityByProductId(order.productId)
          .subscribe((stockQuantity) => {
            console.log("Stock Quantity:", stockQuantity);
            if (!stockQuantity) {
              this.alertifyService.error("No stocks available for this product.");
              return;
            }

            if (stockQuantity < order.quantity) {
              this.alertifyService.error("Insufficient stock quantity.");
              return;
            }

            this.sendUpdateOrderStatusRequest(id, OrderStatus);
          });
      } else {
        this.sendUpdateOrderStatusRequest(id, OrderStatus);
      }
    });
  }

  sendUpdateOrderStatusRequest(id: number, OrderStatus: string) {
    this.orderService.updateOrderStatus(id, OrderStatus).subscribe(
      () => {
        this.alertifyService.success("Order status updated successfully");
        this.getOrderList();
      },
      () => {
        this.alertifyService.error("Failed to update order status.");
      }
    );
  }

  deleteOrder(id: number) {
    this.orderService.deleteOrder(id).subscribe((data) => {
      this.alertifyService.success(data.toString()), this.getOrderList();
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
