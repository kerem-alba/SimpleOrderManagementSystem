import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { CustomerService } from "../../../services/customer.service";
import { AlertifyService } from "app/core/services/alertify.service";
import { Customer } from "../../../model/Customer";

@Component({
  selector: "customer-update-dialog",
  templateUrl: "./customer-update-dialog.component.html",
  styleUrls: ["./customer-update-dialog.component.css"],
})
export class CustomerUpdateDialogComponent implements OnInit {
  customerUpdateForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private customerService: CustomerService,
    private alertifyService: AlertifyService,
    public dialogRef: MatDialogRef<CustomerUpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) {}

  ngOnInit(): void {
    this.createCustomerUpdateForm();
    this.getCustomerById(this.data.id);
  }

  createCustomerUpdateForm() {
    this.customerUpdateForm = this.formBuilder.group({
      id: [0],
      customerName: ["", Validators.required],
      customerCode: ["", Validators.required],
      address: ["", Validators.required],
      phoneNumber: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      isDeleted: [false, Validators.required],
    });
  }

  getCustomerById(id: number) {
    this.customerService.getCustomerById(id).subscribe(
      (customer: Customer) => {
        if (customer) {
          console.log("Customer fetched successfully", customer); // Debug log
          this.customerUpdateForm.setValue({
            id: customer.id,
            customerName: customer.customerName,
            customerCode: customer.customerCode,
            address: customer.address,
            phoneNumber: customer.phoneNumber,
            email: customer.email,
            isDeleted: customer.isDeleted,
          });
        } else {
          console.error("Customer not found");
        }
      },
      (error) => {
        console.error("Error fetching customer:", error);
      }
    );
  }

  save() {
    if (this.customerUpdateForm.valid) {
      const updatedCustomer: Customer = { ...this.customerUpdateForm.value };
      console.log("Updated customer:", updatedCustomer); // Debug log

      this.customerService.updateCustomer(updatedCustomer).subscribe(
        (data) => {
          this.alertifyService.success("Customer updated successfully");
          this.dialogRef.close(true); // Dialog'u kapat ve başarılı sonucu bildir
        },
        (error) => {
          console.error("Error updating customer:", error);
          this.alertifyService.error(
            "An error occurred while updating the customer"
          );
        }
      );
    }
  }

  onNoClick(): void {
    this.dialogRef.close(); // Dialog'u kapat
  }
}
