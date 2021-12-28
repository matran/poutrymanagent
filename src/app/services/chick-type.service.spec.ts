import { TestBed } from '@angular/core/testing';

import { ChickTypeService } from './chick-type.service';

describe('ChickTypeService', () => {
  let service: ChickTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChickTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
