import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoThumbnailCardComponent } from './video-thumbnail-card.component';

describe('VideoThumbnailCardComponent', () => {
  let component: VideoThumbnailCardComponent;
  let fixture: ComponentFixture<VideoThumbnailCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoThumbnailCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoThumbnailCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
