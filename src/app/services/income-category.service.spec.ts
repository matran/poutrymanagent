import { TestBed } from '@angular/core/testing';

import { IncomeCategoryService } from './income-category.service';

describe('IncomeCategoryService', () => {
  let service: IncomeCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncomeCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
