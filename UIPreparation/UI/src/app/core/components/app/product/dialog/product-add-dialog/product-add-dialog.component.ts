import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MatDialog } from "@angular/material/dialog";
import { Product } from "../../models/Product";
import { Size } from "../../models/size.enum";
import { ProductService } from "../../services/product.service";
import { AlertifyService } from "app/core/services/alertify.service";
import { ColorDialogComponent } from "../../../color/color-dialog/color-dialog.component";
import { ColorService } from "../../../color/service/color.service";

@Component({
  selector: "product-add-dialog",
  templateUrl: "./product-add-dialog.component.html",
  styleUrls: ["./product-add-dialog.component.css"],
})
export class ProductAddDialogComponent implements OnInit {
  productAddForm: FormGroup;
  sizeOptions = [
    { label: "Small", value: Size.S },
    { label: "Medium", value: Size.M },
    { label: "Large", value: Size.L },
    { label: "Extra Large", value: Size.XL },
  ];
  colors = [];
  selectedColorId: number | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private alertifyService: AlertifyService,
    public dialogRef: MatDialogRef<ProductAddDialogComponent>,
    private dialog: MatDialog,
    private colorService: ColorService
  ) {}

  ngOnInit(): void {
    this.createProductAddForm();
    this.getColors();
  }

  createProductAddForm() {
    this.productAddForm = this.formBuilder.group({
      id: [0],
      name: ["", Validators.required],
      size: [null, Validators.required],
      colorId: [null, Validators.required],
    });
  }

  getColors(): void {
    this.colorService.getAll().subscribe(
      (data) => {
        const filteredData = data.filter((x) => x.isDeleted == false);
        this.colors = filteredData;
      },
      (error) => {
        console.error("Renkler yüklenirken hata oluştu:", error);
      }
    );
  }

  openColorDialog(): void {
    const dialogRef = this.dialog.open(ColorDialogComponent, {
      width: "500px",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.productAddForm.controls["colorId"].setValue(result.id);
        this.selectedColorId = result.id;
        this.getColors();
      }
    });
  }

  selectColor(color: { id: number; name: string; code: string }) {
    this.productAddForm.controls["colorId"].setValue(color.id);
    this.selectedColorId = color.id;
  }

  save() {
    if (this.productAddForm.valid) {
      const product: Product = Object.assign({}, this.productAddForm.value);
      this.productService.addProduct(product).subscribe(
        (data) => {
          this.alertifyService.success("Product added successfully!");
          this.dialogRef.close(true);
        },
        (error) => {
          this.alertifyService.error("Error adding product");
          console.error("Error adding product:", error);
        }
      );
    } else {
      this.validateAllFormFields(this.productAddForm);
    }
  }

  private validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control && control.errors) {
        console.log(`Error in ${field}:`, control.errors);
      }
      control?.markAsTouched({ onlySelf: true });
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getContrastYIQ(hexcolor: string): string {
    hexcolor = hexcolor.replace("#", "");
    const r = parseInt(hexcolor.substr(0, 2), 16);
    const g = parseInt(hexcolor.substr(2, 2), 16);
    const b = parseInt(hexcolor.substr(4, 2), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? "black" : "white";
  }
}
