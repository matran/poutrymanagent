import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogBatchDateComponent } from './dialog-batch-date.component';

describe('DialogBatchDateComponent', () => {
  let component: DialogBatchDateComponent;
  let fixture: ComponentFixture<DialogBatchDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogBatchDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogBatchDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
