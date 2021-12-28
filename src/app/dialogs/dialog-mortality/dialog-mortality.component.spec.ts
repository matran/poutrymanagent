import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMortalityComponent } from './dialog-mortality.component';

describe('DialogMortalityComponent', () => {
  let component: DialogMortalityComponent;
  let fixture: ComponentFixture<DialogMortalityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogMortalityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogMortalityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
