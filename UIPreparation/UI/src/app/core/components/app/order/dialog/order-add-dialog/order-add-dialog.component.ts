import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrderService } from '../../services/order.service';
import { AlertifyService } from 'app/core/services/alertify.service';
import { CustomerService } from '../../../customer/services/customer.service';
import { ProductService } from '../../../product/services/product.service';

@Component({
  selector: 'app-order-add-dialog',
  templateUrl: './order-add-dialog.component.html',
  styleUrls: ['./order-add-dialog.component.css']
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
      customerId: ['', Validators.required],
      selectedProducts: [[]],
      products: this.fb.array([])
    });
  }

  get selectedProductsControls() {
    return this.orderAddForm.get('products') as FormArray;
  }

  onProductSelectionChange(event) {
    const selectedProductIds = event.value;
    const productControls = this.selectedProductsControls;

    // Clear current controls
    while (productControls.length) {
      productControls.removeAt(0);
    }

    // Add a form group for each selected product
    selectedProductIds.forEach(productId => {
      productControls.push(this.fb.group({
        productId: [productId],
        quantity: [1, Validators.required]
      }));
    });
  }

  getProductName(productId: number): string {
    const product = this.products.find(p => p.id === productId);
    return product ? product.name : '';
  }

  loadCustomers() {
    this.customerService.getCustomerList().subscribe(customers => {
      this.customers = customers;
    });
  }

  loadProducts() {
    this.productService.getProductList().subscribe(products => {
      this.products = products;
    });
  }

  save() {
    if (this.orderAddForm.valid) {
      const orderData = this.orderAddForm.value;
      // Process the orderData before sending to the backend
      // For example, you might want to transform the data structure

      this.orderService.addOrder(orderData).subscribe(
        response => {
          this.alertify.success('Order created successfully');
          this.dialogRef.close();
        },
        error => {
          this.alertify.error('Error creating order');
        }
      );
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
