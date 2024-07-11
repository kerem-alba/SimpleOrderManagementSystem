import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/Product';
import { environment } from '../../../../../../environments/environment'
import { LookUp } from 'app/core/models/LookUp';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpClient: HttpClient) { }

  getProductList(): Observable<Product[]> {

    return this.httpClient.get<Product[]>(environment.getApiUrl + "/products/getall ");
  }

  getProductById(id: number): Observable<Product> {

    return this.httpClient.get<Product>(environment.getApiUrl + `/products/${id}`);
  }


  addProduct(product: Product): Observable<any> {
    const createProductCommand = {Product: product};
    console.log('Gönderilen ürün:', createProductCommand);
    var result = this.httpClient.post(environment.getApiUrl + "/products/", createProductCommand, { responseType: 'text' });
    return result;
  }

  updateProduct(product:Product):Observable<any> {
    var result = this.httpClient.put(environment.getApiUrl + `/products/${product.id}`, product, { responseType: 'text' });
    return result;
  }

  deleteProduct(id: number) {
    return this.httpClient.request('delete', environment.getApiUrl + `/products/${id}`);
  }

}

