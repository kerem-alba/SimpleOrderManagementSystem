import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StockService } from '../../services/stock.service';
import { AlertifyService } from 'app/core/services/alertify.service';
import { Stock } from '../../model/Stock';
import { ProductService } from '../../../product/services/product.service';

@Component({
  selector: 'app-stock-update-dialog',
  templateUrl: './stock-update-dialog.component.html',
  styleUrls: ['./stock-update-dialog.component.css']
})
export class StockUpdateDialogComponent implements OnInit {
  stockUpdateForm: FormGroup;
  products = [];
  currentStock: Stock;

  constructor(
    private fb: FormBuilder,
    private stockService: StockService,
    private productService: ProductService,
    private alertify: AlertifyService,
    public dialogRef: MatDialogRef<StockUpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) {
    console.log('Dialog Data:', data); // Data'nın doğru gelip gelmediğini kontrol edin
  }

  ngOnInit(): void {
    this.createStockUpdateForm();
    if (this.data && this.data.id) {
      this.getStockById(this.data.id);
    }
    this.loadProducts();
  }

  createStockUpdateForm() {
    this.stockUpdateForm = this.fb.group({
      id: [0],
      productId: [{ value: '', disabled: true }, Validators.required],
      quantity: ['', Validators.required],
      isDeleted: [''],
      isReadyForSale: [''],
    });
  }

  getStockById(id: number) {
    this.stockService.getStockById(id).subscribe(
      (stock: Stock) => {
        if (stock) {
          this.currentStock = stock;
          this.stockUpdateForm.setValue({
            id: stock.id,
            productId: stock.productId,
            quantity: stock.quantity,
            isDeleted: stock.isDeleted,
            isReadyForSale: stock.isReadyForSale
          });
        } else {
          console.error('Stock not found');
        }
      },
      (error) => {
        console.error('Error fetching stock:', error);
      }
    );
  }

  loadProducts() {
    this.productService.getProductList().subscribe(products => {
      this.products = products;
    });
  }

  save() {
    if (this.stockUpdateForm.valid) {
      const updatedStock: Stock = {
        ...this.currentStock,
        quantity: this.stockUpdateForm.get('quantity').value,
        isReadyForSale: this.currentStock.isReadyForSale 
      };

      this.stockService.updateStock(updatedStock).subscribe(
        data => {
          this.alertify.success('Stock updated successfully');
          this.dialogRef.close(true);
        },
        error => {
          console.error('Error updating stock:', error);
          this.alertify.error('An error occurred while updating the stock');
        }
      );
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
