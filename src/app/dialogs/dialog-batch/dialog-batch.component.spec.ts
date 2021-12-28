import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogBatchComponent } from './dialog-batch.component';

describe('DialogBatchComponent', () => {
  let component: DialogBatchComponent;
  let fixture: ComponentFixture<DialogBatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogBatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
