import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MortalityComponent } from './mortality.component';

describe('MortalityComponent', () => {
  let component: MortalityComponent;
  let fixture: ComponentFixture<MortalityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MortalityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MortalityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
