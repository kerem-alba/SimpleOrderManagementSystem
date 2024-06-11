/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { SharedService } from './shared.service';

describe('Service: Shared', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SharedService]
        });
    });

    it('should ...', inject([SharedService], (service: SharedService) => {
        expect(service).toBeTruthy();
    }));
});
