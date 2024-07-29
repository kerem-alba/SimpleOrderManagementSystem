import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { OrderService } from "../../services/order.service";
import { AlertifyService } from "app/core/services/alertify.service";
import { CustomerService } from "../../../customer/services/customer.service";
import { ProductService } from "../../../product/services/product.service";
import { StatusEnum } from "../../model/StatusEnum.enum";

@Component({
  selector: "app-order-add-dialog",
  templateUrl: "./order-add-dialog.component.html",
  styleUrls: ["./order-add-dialog.component.css"],
})
export class OrderAddDialogComponent implements OnInit {
  orderAddForm: FormGroup;
  customers = [];
  products = [];

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private customerService: CustomerService,
    private productService: ProductService,
    private alertify: AlertifyService,
    public dialogRef: MatDialogRef<OrderAddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.createOrderAddForm();
    this.loadCustomers();
    this.loadProducts();
  }

  createOrderAddForm() {
    this.orderAddForm = this.fb.group({
      customerId: ["", Validators.required],
      productId: ["", Validators.required],
      quantity: ["", Validators.required],
      orderStatus: [StatusEnum.Pending, Validators.required],
    });
  }

  loadCustomers() {
    this.customerService.getCustomerList().subscribe((customers) => {
      this.customers = customers;
    });
  }

  loadProducts() {
    this.productService.getProductList().subscribe((products) => {
      this.products = products;
    });
  }

  save() {
    if (this.orderAddForm.valid) {
      const orderData = this.orderAddForm.value;
      orderData.orderStatus = StatusEnum.Pending;
      this.orderService.addOrder(orderData).subscribe(
        (response) => {
          this.alertify.success("Order created successfully");
          this.dialogRef.close();
        },
        (error) => {
          this.alertify.error("Error creating order");
        }
      );
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
