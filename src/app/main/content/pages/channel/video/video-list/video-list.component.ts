import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import {
  ActivatedRoute
} from '@angular/router';
import { VideoService } from '../video.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.scss']
})
export class VideoListComponent implements OnInit, OnDestroy {
  isInprogress: boolean;
  videos: Object[];
  onVideosChangedSubscription: Subscription;
  onVideosChangeStartedSubscription: Subscription;
  routeQueryParamsSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private videoService: VideoService
  ) {
    this.isInprogress = false;

    this.onVideosChangeStartedSubscription =
      this.videoService.onVideosChangeStarted.subscribe(res => {
        this.isInprogress = true;
      });

    this.onVideosChangedSubscription =
      this.videoService.onVideosChanged.subscribe(videos => {
        this.videos = videos;
        this.isInprogress = false;
      });
  }

  ngOnInit() {
    this.routeQueryParamsSub = this.route.queryParams.subscribe(queryParams => {
      if(queryParams && queryParams['search']) {
        this.videoService.search(queryParams['search']);
      }
    });
  }

  ngOnDestroy() {
    if(this.onVideosChangedSubscription) {
      this.onVideosChangedSubscription.unsubscribe();
    }

    if(this.onVideosChangeStartedSubscription) {
      this.onVideosChangeStartedSubscription.unsubscribe();
    }

    if(this.routeQueryParamsSub) {
      this.routeQueryParamsSub.unsubscribe();
    }
  }

}
