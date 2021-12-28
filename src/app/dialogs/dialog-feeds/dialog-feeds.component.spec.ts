import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogFeedsComponent } from './dialog-feeds.component';

describe('DialogFeedsComponent', () => {
  let component: DialogFeedsComponent;
  let fixture: ComponentFixture<DialogFeedsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogFeedsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogFeedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
