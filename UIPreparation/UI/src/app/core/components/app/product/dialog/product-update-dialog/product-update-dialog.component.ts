import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductService } from '../../services/product.service';
import { AlertifyService } from 'app/core/services/alertify.service';
import { Product } from '../../models/Product';
import { Size } from '../../models/size.enum';

interface SizeOption {
  value: Size;
  label: string;
}

@Component({
  selector: 'product-update-dialog',
  templateUrl: './product-update-dialog.component.html',
  styleUrls: ['./product-update-dialog.component.css'],
})
export class ProductUpdateDialogComponent implements OnInit {
  productUpdateForm: FormGroup;
  sizeOptions: SizeOption[] = [
    { label: 'Small', value: Size.S },
    { label: 'Medium', value: Size.M },
    { label: 'Large', value: Size.L },
    { label: 'Extra Large', value: Size.XL }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private alertifyService: AlertifyService,
    public dialogRef: MatDialogRef<ProductUpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) {}

  ngOnInit(): void {
    console.log('Dialog data:', this.data);  // Debug log
    this.createProductUpdateForm();
    if (this.data && this.data.id) {
      this.getProductById(this.data.id);
    } else {
      console.error('Dialog data id is invalid');
    }
  }

  createProductUpdateForm() {
    this.productUpdateForm = this.formBuilder.group({
      id: [0],
      name: [''],
      size: [null],
      colorId: [''],
      status: [true],
    });
  }

  getProductById(id: number) {
    this.productService.getProductById(id).subscribe(
      (product: Product) => {
        if (product) {
          console.log('Product fetched successfully', product);  // Debug log
          this.productUpdateForm.setValue({
            id: product.id,
            name: product.name,
            size: product.size,
            colorId: product.colorId,
            status: product.status
          });
        } else {
          console.error('Product not found');
        }
      },
      (error) => {
        console.error('Error fetching product:', error);
      }
    );
  }

  save() {
    if (this.productUpdateForm.valid) {
      const updatedProduct: Product = { ...this.productUpdateForm.value };
      console.log('Updated product:', updatedProduct);  // Debug log

      this.productService.updateProduct(updatedProduct).subscribe(
        data => {
          this.alertifyService.success('Product updated successfully');
          this.dialogRef.close(true);  // Dialog'u kapat ve başarılı sonucu bildir
        },
        error => {
          console.error('Error updating product:', error);
          this.alertifyService.error('An error occurred while updating the product');
        }
      );
    }
  }

  onNoClick(): void {
    this.dialogRef.close();  // Dialog'u kapat
  }
}
