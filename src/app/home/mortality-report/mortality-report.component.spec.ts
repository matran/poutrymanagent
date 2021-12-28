import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MortalityReportComponent } from './mortality-report.component';

describe('MortalityReportComponent', () => {
  let component: MortalityReportComponent;
  let fixture: ComponentFixture<MortalityReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MortalityReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MortalityReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
