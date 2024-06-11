/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { GroupService } from './Group.service';

describe('Service: Group', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [GroupService]
        });
    });

    it('should ...', inject([GroupService], (service: GroupService) => {
        expect(service).toBeTruthy();
    }));
});
