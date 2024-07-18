import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Customer } from "./model/Customer";
import { CustomerService } from "./services/customer.service";
import { IDropdownSettings, NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { LookUp } from "app/core/models/LookUp";
import { AlertifyService } from "app/core/services/alertify.service";
import { LookUpService } from "app/core/services/LookUp.service";
import { MustMatch } from "app/core/directives/must-match";
import { environment } from "environments/environment";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { AuthService } from "../../admin/login/services/auth.service";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import {
  MatFormField,
  MatFormFieldModule,
  MatLabel,
} from "@angular/material/form-field";
import { MatButtonModule, MatIconButton } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { CommonModule } from "@angular/common";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatTooltipModule } from "@angular/material/tooltip";
import { TranslateModule } from "@ngx-translate/core";
import { CustomerAddDialogComponent } from "./dialog/customer-add-dialog/customer-add-dialog/customer-add-dialog.component";
import { CustomerUpdateDialogComponent } from "./dialog/customer-update-dialog/customer-update-dialog/customer-update-dialog.component";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {MatDividerModule} from '@angular/material/divider';
import { MatIconModule } from "@angular/material/icon";



@Component({
  selector: "customer",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatCheckboxModule,
    NgMultiSelectDropDownModule,
    SweetAlert2Module,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    TranslateModule,
    MatDialogModule,
    MatIconButton,
    MatSortModule,
    MatTableModule,
    MatGridListModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    MatIconModule
  ],

        

  providers: [SweetAlert2Module.forRoot().providers],

  templateUrl: "./customer.component.html",
  styleUrls: ["./customer.component.css"],
})
export class CustomerComponent implements AfterViewInit, OnInit {
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [
    "customerId",
    "email",
    "fullName",
    "status",
    "mobilePhones",
    "address",
    "update",
    "delete",
  ];

  customer: Customer = new Customer();
  customerList: Customer[] = [];
  groupDropdownList: LookUp[];
  groupSelectedItems: LookUp[];
  dropdownSettings: IDropdownSettings;

  claimDropdownList: LookUp[];
  claimSelectedItems: LookUp[];

  isGroupChange: boolean = false;
  isClaimChange: boolean = false;

  id: number;
  Filter: string = "";

  constructor(
    private customerService: CustomerService,
    private formBuilder: FormBuilder,
    private alertifyService: AlertifyService,
    private lookUpService: LookUpService,
    private authService: AuthService,
    public dialog: MatDialog
  ) {}

  CustomerAddDialog(): void {
    const dialogRef = this.dialog.open(CustomerAddDialogComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getCustomerList(); // Listesi güncelle
    });
  }

  CustomerUpdateDialog(customerId: number): void {
    const dialogRef = this.dialog.open(CustomerUpdateDialogComponent, {
      data: { id: customerId },
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getCustomerList(); // Listesi güncelle
    });
  }

  ngAfterViewInit(): void {
    this.getCustomerList();
  }

  customerAddForm: FormGroup;

  ngOnInit(): void {
    this.createCustomerAddForm();

    this.dropdownSettings = environment.getDropDownSetting;

    this.lookUpService.getGroupLookUp().subscribe((data) => {
      this.groupDropdownList = data;
    });

    this.lookUpService.getOperationClaimLookUp().subscribe((data) => {
      this.claimDropdownList = data;
    });
  }

  createCustomerAddForm() {
    this.customerAddForm = this.formBuilder.group({
      id: [0],
      customerName: ["", Validators.required],
      customerCode: ["", Validators.required],
      adress: ["", Validators.required],
      phoneNumber: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      status: [true],
    });
  }


  getCustomerList() {
    this.customerService.getCustomerList().subscribe(
      (data) => {
        this.customerList = data;
        this.dataSource = new MatTableDataSource(data);
        this.configDataTable();

        // Verinin doğru formatta olduğundan emin olun
        this.dataSource.data.forEach((customer) => {
          console.log("Customer:", customer); // Kullanıcı verilerini kontrol etmek için
          console.log("Type of status:", typeof customer.status); // status alanının türünü kontrol etmek için
        });
      },
      (error) => {
        console.error("Error fetching customer list:", error);
      }
    );
  }

  clearFormGroup(group: FormGroup) {
    group.markAsUntouched();
    group.reset();
    Object.keys(group.controls).forEach((key) => {
      group.get(key).setErrors(null);
      if (key === "id") group.get(key).setValue(0);
      else if (key === "status") group.get(key).setValue(true);
    });
    console.log(group.controls); // Form kontrollerinin sıfırlanmış hallerini kontrol etmek için
  }

  setCustomerId(id: number) {
    this.id = id;
  }

  save() {
    if (this.customerAddForm.valid) {
        console.log('Form submitted', this.customerAddForm.value);
        this.customer = Object.assign({}, this.customerAddForm.value);

        if (this.customer.id == 0) this.addCustomer();
        else this.updateCustomer();
    }
    else {
        console.log('Form is invalid');
        console.log(this.customerAddForm.controls);  // Kontrol edilecek alanlar
        for (const control in this.customerAddForm.controls) {
            if (this.customerAddForm.controls[control].errors) {
                console.log(`Error in ${control}:`, this.customerAddForm.controls[control].errors);
            }
        }
    }
  }

  addCustomer() {
    this.customerService.addCustomer(this.customer).subscribe((data) => {
      this.getCustomerList();
      this.customer = new Customer();
      this.alertifyService.success(data);
      this.clearFormGroup(this.customerAddForm);
    }, error => {
      console.error('Error adding customer:', error);
    });
  }

  getCustomerById(id: number) {
    this.clearFormGroup(this.customerAddForm);
    this.customerService.getCustomerById(id).subscribe((data) => {
      this.customer = data;
      this.customerAddForm.patchValue(data);
    });
  }

  updateCustomer() {
    this.customerService.updateCustomer(this.customer).subscribe((data) => {
      var index = this.customerList.findIndex(
        (x) => x.id == this.customer.id
      );
      this.customerList[index] = this.customer;
      this.dataSource = new MatTableDataSource(this.customerList);
      this.configDataTable();
      this.customer = new Customer();
      this.alertifyService.success(data);
      this.clearFormGroup(this.customerAddForm);
    });
  }

  deleteCustomer(id: number) {
    this.customerService.deleteCustomer(id).subscribe((data) => {
      this.alertifyService.success(data.toString());
      var index = this.customerList.findIndex((x) => x.id == id);
      this.customerList[index].status = false;
      this.dataSource = new MatTableDataSource(this.customerList);
      this.configDataTable();
    });
  }

  checkClaim(claim: string): boolean {
    return this.authService.claimGuard(claim);
  }

  configDataTable(): void {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}