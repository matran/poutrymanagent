import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogFreportsComponent } from './dialog-freports.component';

describe('DialogFreportsComponent', () => {
  let component: DialogFreportsComponent;
  let fixture: ComponentFixture<DialogFreportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogFreportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogFreportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
