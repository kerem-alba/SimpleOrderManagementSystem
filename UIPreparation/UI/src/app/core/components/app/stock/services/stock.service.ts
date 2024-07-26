import { HttpClient, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Stock } from '../model/Stock';
import { environment } from '../../../../../../environments/environment'
import { LookUp } from 'app/core/models/LookUp';


@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(private httpClient: HttpClient) { }

  getStockList(): Observable<Stock[]> {

    return this.httpClient.get<Stock[]>(environment.getApiUrl + "/stocks/getallwithdetails ");
  }

  getStockById(id: number): Observable<Stock> {
    const params = new HttpParams().set('id', id.toString());
    return this.httpClient.get<Stock>(environment.getApiUrl + `/stocks/getbyid`, { params });
  }


  addStock(stock: Stock): Observable<any> {
    console.log('Gönderilen ürün:', stock);
    return this.httpClient.post(environment.getApiUrl + "/stocks/", stock, { responseType: 'text' });
}


  updateStock(stock:Stock):Observable<any> {
    var result = this.httpClient.put(environment.getApiUrl + `/stocks/`, stock, { responseType: 'text' });
    return result;
  }

  deleteStock(id: number) {
    return this.httpClient.request('delete', environment.getApiUrl + `/stocks/${id}`);
  }
  
}

