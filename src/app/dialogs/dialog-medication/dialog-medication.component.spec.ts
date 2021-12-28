import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMedicationComponent } from './dialog-medication.component';

describe('DialogMedicationComponent', () => {
  let component: DialogMedicationComponent;
  let fixture: ComponentFixture<DialogMedicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogMedicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogMedicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
