import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { AppRoutingModule } from "./app.routing";
import { AppComponent } from "./app.component";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { ComponentsModule } from "./core/modules/components.module";
import { AdminLayoutComponent } from "./core/components/app/layouts/admin-layout/admin-layout.component";
import { TranslationService } from "./core/services/Translation.service";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { LoginGuard } from "./core/guards/login-guard";
import { AuthInterceptorService } from "./core/interceptors/auth-interceptor.service";
import { HttpEntityRepositoryService } from "./core/services/http-entity-repository.service";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule, MatIconButton } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { ProductAddDialogComponent } from "./core/components/app/product/dialog/product-add-dialog/product-add-dialog.component";
import { MatFormField, MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { ProductUpdateDialogComponent } from "./core/components/app/product/dialog/product-update-dialog/product-update-dialog.component";
import { Customer } from "./core/components/app/customer/model/Customer";
import { CustomerAddDialogComponent } from "./core/components/app/customer/dialog/customer-add-dialog/customer-add-dialog/customer-add-dialog.component";
import { CustomerUpdateDialogComponent } from "./core/components/app/customer/dialog/customer-update-dialog/customer-update-dialog/customer-update-dialog.component";
import { Order } from "./core/components/app/order/model/Order";
import { OrderAddDialogComponent } from "./core/components/app/order/dialog/order-add-dialog/order-add-dialog.component";
import { StockAddDialogComponent } from "./core/components/app/stock/dialog/stock-add-dialog/stock-add-dialog.component";
import { StockUpdateDialogComponent } from "./core/components/app/stock/dialog/stock-update-dialog/stock-update-dialog.component";
import { ColorDialogComponent } from "./core/components/app/color/color-dialog/color-dialog.component";
import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { AsyncPipe } from "@angular/common";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

export function tokenGetter() {
  return localStorage.getItem("token");
}

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    MatDialogModule,
    AppRoutingModule,
    MatIconButton,
    MatIconModule,
    NgMultiSelectDropDownModule.forRoot(),
    SweetAlert2Module.forRoot(),
    NgbModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        //useFactory:HttpLoaderFactory, //i18 kullanılacak ise useClass kapatılıp yukarıda bulunan HttpLoaderFactory ve bu satır aktif edilecek
        useClass: TranslationService,
        deps: [HttpClient],
      },
    }),
    MatSelectModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatAutocompleteModule,
    AsyncPipe,
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    ProductAddDialogComponent,
    ProductUpdateDialogComponent,
    CustomerAddDialogComponent,
    CustomerUpdateDialogComponent,
    OrderAddDialogComponent,
    StockAddDialogComponent,
    StockUpdateDialogComponent,
    ColorDialogComponent,
  ],

  providers: [
    LoginGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    HttpEntityRepositoryService,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
