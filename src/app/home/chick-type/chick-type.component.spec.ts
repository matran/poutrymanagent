import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChickTypeComponent } from './chick-type.component';

describe('ChickTypeComponent', () => {
  let component: ChickTypeComponent;
  let fixture: ComponentFixture<ChickTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChickTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChickTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
