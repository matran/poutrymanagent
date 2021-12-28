import { TestBed } from '@angular/core/testing';

import { FeedsCategoryService } from './feeds-category.service';

describe('FeedsCategoryService', () => {
  let service: FeedsCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeedsCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
