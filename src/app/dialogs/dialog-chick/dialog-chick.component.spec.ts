import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogChickComponent } from './dialog-chick.component';

describe('DialogChickComponent', () => {
  let component: DialogChickComponent;
  let fixture: ComponentFixture<DialogChickComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogChickComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogChickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
