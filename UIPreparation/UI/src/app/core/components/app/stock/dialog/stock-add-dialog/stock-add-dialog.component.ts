import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { StockService } from "../../services/stock.service";
import { AlertifyService } from "app/core/services/alertify.service";
import { ProductService } from "../../../product/services/product.service";

@Component({
  selector: "app-stock-add-dialog",
  templateUrl: "./stock-add-dialog.component.html",
  styleUrls: ["./stock-add-dialog.component.css"],
})
export class StockAddDialogComponent implements OnInit {
  stockAddForm: FormGroup;
  products = [];

  constructor(
    private fb: FormBuilder,
    private stockService: StockService,
    private productService: ProductService,
    private alertify: AlertifyService,
    public dialogRef: MatDialogRef<StockAddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.createStockAddForm();
    this.loadProducts();
  }

  createStockAddForm() {
    this.stockAddForm = this.fb.group({
      productId: ["", Validators.required],
      quantity: ["", Validators.required],
      isDeleted: [false],
      isReadyForSale: [false],
    });
  }

  loadProducts() {
    this.productService.getProductList().subscribe((products) => {
      this.products = products;
    });
  }

  save() {
    if (this.stockAddForm.valid) {
      const stockData = this.stockAddForm.value;
      console.log("Form Data:", stockData); // Form verilerini kontrol edin

      this.stockService.addStock(stockData).subscribe(
        (response) => {
          this.alertify.success("Stock created successfully");
          this.dialogRef.close();
        },
        (error) => {
          console.error("Error creating stock:", error);
          this.alertify.error("Error creating stock");
        }
      );
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
