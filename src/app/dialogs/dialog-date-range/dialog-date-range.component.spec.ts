import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDateRangeComponent } from './dialog-date-range.component';

describe('DialogDateRangeComponent', () => {
  let component: DialogDateRangeComponent;
  let fixture: ComponentFixture<DialogDateRangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogDateRangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDateRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
