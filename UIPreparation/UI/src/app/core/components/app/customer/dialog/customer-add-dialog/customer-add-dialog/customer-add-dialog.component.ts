import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CustomerService } from '../../../services/customer.service';
import { AlertifyService } from 'app/core/services/alertify.service';
import { Customer } from '../../../model/Customer';

@Component({
  selector: 'customer-add-dialog',
  templateUrl: './customer-add-dialog.component.html',
  styleUrls: ['./customer-add-dialog.component.css'],
})
export class CustomerAddDialogComponent implements OnInit {
  customerAddForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private customerService: CustomerService,
    private alertifyService: AlertifyService,
    public dialogRef: MatDialogRef<CustomerAddDialogComponent>
  ) {}

  ngOnInit(): void {
    this.createCustomerAddForm();
  }

  createCustomerAddForm() {
    this.customerAddForm = this.formBuilder.group({
      customerName: ['', Validators.required],
      customerCode: ['', Validators.required],
      address: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      status: [true, Validators.required],
    });
  }

  save() {
    if (this.customerAddForm.valid) {
      const newCustomer: Customer = { ...this.customerAddForm.value };
      console.log('New customer:', newCustomer);  // Debug log

      this.customerService.addCustomer(newCustomer).subscribe(
        data => {
          this.alertifyService.success('Customer added successfully');
          this.dialogRef.close(true);  // Dialog'u kapat ve başarılı sonucu bildir
        },
        error => {
          console.error('Error adding customer:', error);
          this.alertifyService.error('An error occurred while adding the customer');
        }
      );
    }
  }

  onNoClick(): void {
    this.dialogRef.close();  // Dialog'u kapat
  }
}
