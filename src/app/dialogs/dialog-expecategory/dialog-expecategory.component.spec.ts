import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogExpecategoryComponent } from './dialog-expecategory.component';

describe('DialogExpecategoryComponent', () => {
  let component: DialogExpecategoryComponent;
  let fixture: ComponentFixture<DialogExpecategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogExpecategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogExpecategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
