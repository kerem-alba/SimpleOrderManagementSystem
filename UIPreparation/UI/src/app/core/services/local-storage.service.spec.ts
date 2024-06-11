/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { LocalStorageService } from './local-storage.service';

describe('Service: LocalStorage', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [LocalStorageService]
        });
    });

    it('should ...', inject([LocalStorageService], (service: LocalStorageService) => {
        expect(service).toBeTruthy();
    }));
});
