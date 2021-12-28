import { TestBed } from '@angular/core/testing';

import { AllExpensesService } from './all-expenses.service';

describe('AllExpensesService', () => {
  let service: AllExpensesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllExpensesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
