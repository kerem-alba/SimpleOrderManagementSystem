import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Observable } from "rxjs/internal/Observable";

@Injectable({
    providedIn: 'root'
})
export class SharedService {
    private subject = new Subject<any>();

    sendChangeUserNameEvent() {
        //this.subject.next();

    }
    getChangeUserNameClickEvent(): Observable<any> {
        return this.subject.asObservable();
    }

}
