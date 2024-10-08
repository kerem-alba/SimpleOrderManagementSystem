import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { environment } from 'environments/environment';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable()

@Injectable({
  providedIn: 'root'
})
export class TranslationService implements TranslateLoader {

  constructor(private http: HttpClient) { }

  getTranslation(lang: string): Observable<any> {
    return this.http.get(environment.getApiUrl + `/translates/languages/${lang}`);
  }
}