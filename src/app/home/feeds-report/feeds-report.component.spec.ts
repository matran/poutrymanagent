import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedsReportComponent } from './feeds-report.component';

describe('FeedsReportComponent', () => {
  let component: FeedsReportComponent;
  let fixture: ComponentFixture<FeedsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
