import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Customer } from "./model/Customer";
import { CustomerService } from "./services/customer.service";
import { AlertifyService } from "app/core/services/alertify.service";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { AuthService } from "../../admin/login/services/auth.service";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule, MatIconButton } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { CommonModule } from "@angular/common";
import { MatRippleModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatTooltipModule } from "@angular/material/tooltip";
import { TranslateModule } from "@ngx-translate/core";
import { CustomerAddDialogComponent } from "./dialog/customer-add-dialog/customer-add-dialog/customer-add-dialog.component";
import { CustomerUpdateDialogComponent } from "./dialog/customer-update-dialog/customer-update-dialog/customer-update-dialog.component";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatDividerModule } from "@angular/material/divider";
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
    MatDividerModule,
    MatIconModule,
  ],

  templateUrl: "./customer.component.html",
  styleUrls: ["./customer.component.css"],
})
export class CustomerComponent implements AfterViewInit, OnInit {
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [
    "customerId",
    "fullName",
    "email",
    "mobilePhones",
    "address",
    "update",
    "delete",
  ];

  customer: Customer = new Customer();
  customerList: Customer[] = [];

  isGroupChange: boolean = false;
  isClaimChange: boolean = false;

  id: number;
  Filter: string = "";

  constructor(
    private customerService: CustomerService,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    public dialog: MatDialog
  ) {}

  CustomerAddDialog(): void {
    const dialogRef = this.dialog.open(CustomerAddDialogComponent, {
      width: "500px",
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getCustomerList(); // Listesi güncelle
    });
  }

  CustomerUpdateDialog(customerId: number): void {
    const dialogRef = this.dialog.open(CustomerUpdateDialogComponent, {
      data: { id: customerId },
      width: "500px",
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getCustomerList(); // Listesi güncelle
    });
  }

  ngAfterViewInit(): void {
    this.getCustomerList();
  }

  customerAddForm: FormGroup;

  ngOnInit(): void {}

  getCustomerList() {
    this.customerService.getCustomerList().subscribe(
      (data) => {
        const dataFiltered = data.filter((x) => x.isDeleted == false);
        this.customerList = data;
        this.dataSource = new MatTableDataSource(dataFiltered);
        this.configDataTable();
      },
      (error) => {
        this.alertifyService.error("Error getting customers");
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
  }

  save() {
    if (this.customerAddForm.valid) {
      console.log("Form submitted", this.customerAddForm.value);
      this.customer = Object.assign({}, this.customerAddForm.value);

      if (this.customer.id == 0) this.addCustomer();
      else this.updateCustomer();
    } else {
      this.alertifyService.error("Please fill in the required fields");
    }
  }

  addCustomer() {
    this.customerService.addCustomer(this.customer).subscribe(
      (data) => {
        this.getCustomerList();
        this.customer = new Customer();
        this.alertifyService.success(data);
        this.clearFormGroup(this.customerAddForm);
      },
      (error) => {
        this.alertifyService.error("Error adding customer");
      }
    );
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
      this.dataSource = new MatTableDataSource(this.customerList);
      this.configDataTable();
      this.alertifyService.success(data);
      this.clearFormGroup(this.customerAddForm);
    });
  }

  deleteCustomer(id: number) {
    console.log("Delete customer with id:", id);
    this.customerService.deleteCustomer(id).subscribe((data) => {
      this.alertifyService.success(data.toString());
      this.getCustomerList();
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
