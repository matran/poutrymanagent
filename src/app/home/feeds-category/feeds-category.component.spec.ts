import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedsCategoryComponent } from './feeds-category.component';

describe('FeedsCategoryComponent', () => {
  let component: FeedsCategoryComponent;
  let fixture: ComponentFixture<FeedsCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedsCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedsCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
