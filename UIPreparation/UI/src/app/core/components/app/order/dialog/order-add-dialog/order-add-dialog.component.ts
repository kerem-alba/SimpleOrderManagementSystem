import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { OrderService } from "../../services/order.service";
import { AlertifyService } from "app/core/services/alertify.service";
import { CustomerService } from "../../../customer/services/customer.service";
import { ProductService } from "../../../product/services/product.service";
import { ColorService } from "../../../color/service/color.service";
import { StatusEnum } from "../../model/StatusEnum.enum";
import { Color } from "../../../color/model/Color";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { Order } from "../../model/Order";

@Component({
  selector: "app-order-add-dialog",
  templateUrl: "./order-add-dialog.component.html",
  styleUrls: ["./order-add-dialog.component.css"],
})
export class OrderAddDialogComponent implements OnInit {
  orderAddForm: FormGroup;
  customers = [];
  products = [];
  uniqueProductNames: string[] = [];
  uniqueSizes: string[] = [];
  uniqueColors: Color[] = [];

  filteredCustomers: Observable<Array<{ id: number; customerName: string }>>;

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private customerService: CustomerService,
    private productService: ProductService,
    private colorService: ColorService,
    private alertify: AlertifyService,
    public dialogRef: MatDialogRef<OrderAddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.createOrderAddForm();
    this.loadCustomers();
    this.loadProducts();

    this.filteredCustomers = this.orderAddForm.get("customerName").valueChanges.pipe(
      startWith(""),
      map((value) => this._filterCustomers(value || ""))
    );

    this.orderAddForm.get("productName").valueChanges.subscribe((productName) => {
      if (productName) {
        this.orderAddForm.get("size").enable();
        this.getUniqueSizesByName(productName);
      } else {
        this.orderAddForm.get("size").disable();
        this.orderAddForm.get("color").disable();
      }
      this.uniqueColors = [];
    });

    this.orderAddForm.get("size").valueChanges.subscribe((size) => {
      const productName = this.orderAddForm.get("productName").value;
      if (size) {
        this.orderAddForm.get("color").enable();
        this.getUniqueColorsByNameAndSize(productName, size);
      } else {
        this.orderAddForm.get("color").disable();
      }
    });

    this.orderAddForm.get("size").disable();
    this.orderAddForm.get("color").disable();
  }

  private _filterCustomers(value: string): Array<{ id: number; customerName: string }> {
    const filterValue = value.toLowerCase();
    return this.customers.filter((customer) =>
      customer.customerName.toLowerCase().includes(filterValue)
    );
  }

  createOrderAddForm() {
    this.orderAddForm = this.fb.group({
      customerName: ["", Validators.required],
      productName: ["", Validators.required],
      size: ["", Validators.required],
      color: ["", Validators.required],
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
      this.products = products.filter((product) => !product.isDeleted);
      this.getUniqueProductNames();
    });
  }

  getUniqueProductNames(): void {
    const names = this.products.map((product) => product.name);
    this.uniqueProductNames = Array.from(new Set(names));
  }

  getUniqueSizesByName(name: string): void {
    const filteredProducts = this.products.filter((product) => product.name === name);
    const sizes = filteredProducts.map((product) => product.size);
    this.uniqueSizes = Array.from(new Set(sizes));
    console.log("Sizes ", this.uniqueSizes);
  }

  getUniqueColorsByNameAndSize(name: string, size: string): void {
    this.productService.getColorsByProductAndSize(name, size).subscribe((colors) => {
      this.uniqueColors = colors;
      console.log("Colors ", this.uniqueColors);
    });
  }

  save() {
    if (this.orderAddForm.valid) {
      const productName = this.orderAddForm.get("productName").value;
      const size = this.orderAddForm.get("size").value;
      const colorId = this.orderAddForm.get("color").value;

      const customerName = this.orderAddForm.get("customerName").value;
      const customer = this.customers.find((c) => c.customerName === customerName);
      const customerId = customer ? customer.id : null;

      this.productService
        .getProductByAttributes(productName, size, colorId)
        .subscribe((product) => {
          const orderData = {
            quantity: this.orderAddForm.get("quantity").value,
            customerId: customerId,
            productId: product.id,
          };

          this.orderService.addOrder(orderData).subscribe(
            (response) => {
              this.alertify.success(response);
              this.dialogRef.close();
            },
            (error) => {
              this.alertify.error("Error creating order");
            }
          );
        });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
