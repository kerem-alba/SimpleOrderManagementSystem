import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ProductService } from "../../services/product.service";
import { ColorService } from "../../../color/service/color.service";
import { AlertifyService } from "app/core/services/alertify.service";
import { Product } from "../../models/Product";
import { Size } from "../../models/size.enum";

interface SizeOption {
  value: Size;
  label: string;
}

@Component({
  selector: "product-update-dialog",
  templateUrl: "./product-update-dialog.component.html",
  styleUrls: ["./product-update-dialog.component.css"],
})
export class ProductUpdateDialogComponent implements OnInit {
  productUpdateForm: FormGroup;
  sizeOptions: SizeOption[] = [
    { label: "Small", value: Size.S },
    { label: "Medium", value: Size.M },
    { label: "Large", value: Size.L },
    { label: "Extra Large", value: Size.XL },
  ];
  colorOptions: any[] = [];
  product: Product;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private colorService: ColorService,
    private alertifyService: AlertifyService,
    public dialogRef: MatDialogRef<ProductUpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) {}

  ngOnInit(): void {
    this.createProductUpdateForm();
    this.getProductById(this.data.id);
    this.getColorOptions();
  }

  createProductUpdateForm() {
    this.productUpdateForm = this.formBuilder.group({
      name: [""],
      size: [null],
      color: [null],
    });
  }

  getProductById(id: number) {
    console.log("Calling getProductById with ID:", id);
    this.productService.getProductById(id).subscribe(
      (product: Product) => {
        if (product) {
          this.product = product;
          this.productUpdateForm.patchValue({
            name: product.name,
            size: product.size,
            color: product.colorId,
          });
          console.log("Form values updated:", this.productUpdateForm.value);
        } else {
          console.error("Product is undefined or null.");
        }
      },
      (error) => {
        console.error("Error fetching product:", error);
      }
    );
  }

  getColorOptions() {
    this.colorService.getAll().subscribe(
      (colors) => {
        this.colorOptions = colors;
      },
      (error) => {
        console.error("Renkler alınamadı:", error);
      }
    );
  }

  save() {
    if (this.productUpdateForm.valid) {
      const updatedProduct: Product = {
        id: this.data.id,
        name: this.productUpdateForm.get("name")?.value || this.product.name,
        size: this.productUpdateForm.get("size")?.value || this.product.size,
        colorId: this.productUpdateForm.get("color")?.value || this.product.colorId,
        isDeleted: false,
      };
      console.log("Updated product:", updatedProduct);

      this.productService.updateProduct(updatedProduct).subscribe(
        (data) => {
          this.alertifyService.success("Product updated successfully");
          this.dialogRef.close(true);
        },
        (error) => {
          console.error("Error updating product:", error);
          this.alertifyService.error("An error occurred while updating the product");
        }
      );
    }
  }

  onNoClick(): void {
    this.dialogRef.close(); // Dialog'u kapat
  }
}
