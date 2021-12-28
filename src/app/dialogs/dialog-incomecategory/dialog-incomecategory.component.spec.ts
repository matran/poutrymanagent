import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogIncomecategoryComponent } from './dialog-incomecategory.component';

describe('DialogIncomecategoryComponent', () => {
  let component: DialogIncomecategoryComponent;
  let fixture: ComponentFixture<DialogIncomecategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogIncomecategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogIncomecategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
