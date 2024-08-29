import { HttpClient, HttpHeaders, HttpResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Order } from "../model/Order";
import { environment } from "../../../../../../environments/environment";
import { LookUp } from "app/core/models/LookUp";

@Injectable({
  providedIn: "root",
})
export class OrderService {
  constructor(private httpClient: HttpClient) {}

  getOrderList(): Observable<Order[]> {
    return this.httpClient.get<Order[]>(environment.getApiUrl + "/orders/getallwithdetails ");
  }

  getOrderById(id: number): Observable<Order> {
    const params = new HttpParams().set("id", id.toString());
    return this.httpClient.get<Order>(environment.getApiUrl + `/orders/getbyid`, { params });
  }

  addOrder(order: Order): Observable<any> {
    console.log("Gönderilen ürün:", order);
    var result = this.httpClient.post(
      environment.getApiUrl + "/orders/",
      { Order: order },
      { responseType: "text" }
    );
    return result;
  }

  updateOrder(order: Order): Observable<any> {
    var result = this.httpClient.put(environment.getApiUrl + `/orders/`, order, {
      responseType: "text",
    });
    return result;
  }

  deleteOrder(id: number) {
    return this.httpClient.request("delete", environment.getApiUrl + `/orders/${id}`);
  }

  updateOrderStatus(id: number, status: string, quantity: number): Observable<any> {
    const payload = { id, status, quantity };
    return this.httpClient.put(environment.getApiUrl + `/orders/updateOrderStatus`, payload);
  }
}
