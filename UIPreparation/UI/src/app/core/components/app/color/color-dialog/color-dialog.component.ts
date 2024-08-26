import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { ColorService } from "../service/color.service";
import { Color } from "../model/Color";

@Component({
  selector: "app-color-dialog",
  templateUrl: "./color-dialog.component.html",
  styleUrls: ["./color-dialog.component.css"],
})
export class ColorDialogComponent implements OnInit {
  colors: Color[] = [];
  newColor = { id: 0, name: "", code: "#ffffff", isDeleted: false };
  colorPicker: string = "#ffffff";

  constructor(
    public dialogRef: MatDialogRef<ColorDialogComponent>,
    private colorService: ColorService
  ) {}

  ngOnInit(): void {
    this.getColors();
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

  onColorSelected() {
    this.newColor.code = this.colorPicker;
  }

  createColor() {
    if (this.newColor.name && this.newColor.code) {
      this.colorService.addColor(this.newColor).subscribe(
        (response) => {
          console.log("Renk eklendi:", response);
          this.getColors();
        },
        (error) => {
          console.error("Renk eklenirken hata oluştu:", error);
        }
      );
    }
  }

  selectColor(color: { id: number; name: string; code: string }) {
    this.dialogRef.close(color);
  }

  deleteColor(color: Color) {
    this.colorService.deleteColor(color.id).subscribe(
      () => {
        this.getColors();
      },
      (error) => {
        console.error("Renk silinirken hata oluştu:", error);
      }
    );
  }

  onClose(): void {
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
