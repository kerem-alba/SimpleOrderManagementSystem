import { HttpClient, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../model/Customer';
import { environment } from '../../../../../../environments/environment'
import { LookUp } from 'app/core/models/LookUp';


@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private httpClient: HttpClient) { }

  getCustomerList(): Observable<Customer[]> {

    return this.httpClient.get<Customer[]>(environment.getApiUrl + "/customers/getall ");
  }

  getCustomerById(id: number): Observable<Customer> {
    const params = new HttpParams().set('id', id.toString());
    return this.httpClient.get<Customer>(environment.getApiUrl + `/customers/getbyid`, { params });
  }


  addCustomer(customer: Customer): Observable<any> {
    const createCustomerCommand = {customer};
    console.log('Gönderilen ürün:', createCustomerCommand);
    var result = this.httpClient.post(environment.getApiUrl + "/customers/", createCustomerCommand, { responseType: 'text' });
    return result;
  }

  updateCustomer(customer:Customer):Observable<any> {
    var result = this.httpClient.put(environment.getApiUrl + `/customers/`, customer, { responseType: 'text' });
    return result;
  }

  deleteCustomer(id: number) {
    return this.httpClient.request('delete', environment.getApiUrl + `/customers/${id}`);
  }

}

