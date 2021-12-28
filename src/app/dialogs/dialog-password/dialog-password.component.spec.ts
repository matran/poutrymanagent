import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPasswordComponent } from './dialog-password.component';

describe('DialogPasswordComponent', () => {
  let component: DialogPasswordComponent;
  let fixture: ComponentFixture<DialogPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
