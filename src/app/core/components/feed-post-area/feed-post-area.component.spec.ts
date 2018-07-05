import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedPostAreaComponent } from './feed-post-area.component';

describe('FeedPostAreaComponent', () => {
  let component: FeedPostAreaComponent;
  let fixture: ComponentFixture<FeedPostAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedPostAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedPostAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
