import { HttpClient, HttpHeaders, HttpResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Color } from "../model/Color";
import { environment } from "../../../../../../environments/environment";
import { LookUp } from "app/core/models/LookUp";

@Injectable({
  providedIn: "root",
})
export class ColorService {
  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<Color[]> {
    return this.httpClient.get<Color[]>(environment.getApiUrl + "/colors/getall ");
  }

  getColorById(id: number): Observable<Color> {
    const params = new HttpParams().set("id", id.toString());
    return this.httpClient.get<Color>(environment.getApiUrl + `/colors/getbyid`, { params });
  }

  addColor(color: Color): Observable<any> {
    console.log("Gönderilen renk:", color);
    return this.httpClient.post(environment.getApiUrl + "/colors/", color, {
      responseType: "text",
    });
  }

  updateColor(color: Color): Observable<any> {
    var result = this.httpClient.put(environment.getApiUrl + `/colors/`, color, {
      responseType: "text",
    });
    return result;
  }

  deleteColor(id: number) {
    return this.httpClient.request("delete", environment.getApiUrl + `/colors/${id}`);
  }
}
