import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogIncomeComponent } from './dialog-income.component';

describe('DialogIncomeComponent', () => {
  let component: DialogIncomeComponent;
  let fixture: ComponentFixture<DialogIncomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogIncomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
