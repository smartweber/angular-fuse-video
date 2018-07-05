import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoPlayerCardComponent } from './video-player-card.component';

describe('VideoPlayerCardComponent', () => {
  let component: VideoPlayerCardComponent;
  let fixture: ComponentFixture<VideoPlayerCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoPlayerCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoPlayerCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
