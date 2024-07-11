import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Product } from '../../models/Product';
import { Size } from '../../models/size.enum';
import { ProductService } from '../../services/product.service';
import { AlertifyService } from 'app/core/services/alertify.service';



interface SizeOption {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'product-add-dialog',
  templateUrl: './product-add-dialog.component.html',
  styleUrls: ['./product-add-dialog.component.css'],
})
export class ProductAddDialogComponent implements OnInit {
  productAddForm: FormGroup;
  sizeOptions = [
    { label: 'Small', value: Size.S },
    { label: 'Medium', value: Size.M },
    { label: 'Large', value: Size.L },
    { label: 'Extra Large', value: Size.XL }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private alertifyService: AlertifyService,
    public dialogRef: MatDialogRef<ProductAddDialogComponent>

  ) {}

  ngOnInit(): void {
    this.createProductAddForm();
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

  save() {
    if (this.productAddForm.valid) {
      console.log('Form submitted', this.productAddForm.value);
      const product: Product = Object.assign({}, this.productAddForm.value);

      this.productService.addProduct(product).subscribe(
        data => {
          this.alertifyService.success(data);
          this.dialogRef.close(true);  // Dialog'u kapat ve başarılı sonucu bildir
        },
        error => {
          console.error('Error adding product:', error);
        }
      );
    } else {
      console.log('Form is invalid');
      console.log(this.productAddForm.controls);  // Kontrol edilecek alanlar
      for (const control in this.productAddForm.controls) {
        if (this.productAddForm.controls[control].errors) {
          console.log(`Error in ${control}:`, this.productAddForm.controls[control].errors);
        }
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close();  // Dialog'u kapat
  }
}
