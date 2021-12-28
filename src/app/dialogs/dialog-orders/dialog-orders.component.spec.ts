import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogOrdersComponent } from './dialog-orders.component';

describe('DialogOrdersComponent', () => {
  let component: DialogOrdersComponent;
  let fixture: ComponentFixture<DialogOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
