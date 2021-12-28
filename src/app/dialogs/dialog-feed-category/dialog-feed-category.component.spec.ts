import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogFeedCategoryComponent } from './dialog-feed-category.component';

describe('DialogFeedCategoryComponent', () => {
  let component: DialogFeedCategoryComponent;
  let fixture: ComponentFixture<DialogFeedCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogFeedCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogFeedCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
