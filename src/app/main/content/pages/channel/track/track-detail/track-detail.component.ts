import { Component, OnInit } from '@angular/core';
import {
  Router,
  ActivatedRoute
} from '@angular/router';
import {
  MatDialog
} from '@angular/material';
import { TrackService } from '../track.service';
import { HttpService } from '../../../../../../core/services/http.service';
import { CognitoService } from '../../../../../../core/services/cognito.service';
import { AlertDialogComponent } from '../../../../../../core/components/alert-dialog/alert-dialog.component';
import { environment } from '../../../../../../../environments/environment';

@Component({
  selector: 'app-track-detail',
  templateUrl: './track-detail.component.html',
  styleUrls: ['./track-detail.component.scss']
})
export class TrackDetailComponent implements OnInit {
  routeSub: any;
  videoLink: string;
  videoTitle: string;
  videoAbstract: string;
  quickGuideLink: string;

  isLoadPage: boolean

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private trackService: TrackService,
    private httpService: HttpService,
    private cognitoService: CognitoService,
    private dialog: MatDialog
  ) {
    this.videoLink = '';
    this.videoTitle = '';
    this.videoAbstract = '';

    this.isLoadPage = false;
  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      let trackId = params['track_id'];
      let stepId = params['step_id'];
      let videoApi = environment['api'] + 'videos/';
      videoApi += stepId;

      this.httpService.get(videoApi, true)
        .subscribe((res: any) => {
          this.videoAbstract = (res['data'] && res['data']['abstract'])?res['data']['abstract']:'';
          this.videoTitle = (res['data'] && res['data']['title'])?res['data']['title']:'';
          this.videoLink = (res['data'] && res['data']['videoSrc'])?res['data']['videoSrc']:'';
          this.quickGuideLink = (res['data'] && res['data']['quickGuide'])?res['data']['quickGuide']:'';
          this.isLoadPage = true;
        }, (error: any) => {
          this.alertError(error);
        });

      this.trackService.emitTrackRouteChange({
        trackId: trackId,
        stepId: stepId
      });

    });
  }

  ngOnDestroy() {
    if(this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  alertError(error: Object) {
    if(error['type'] === 0) {
      let config = {
        width: '400px',
        disableClose: false,
        data: {
          type: 'info',
          comment: error['message']
        }
      };
      this.dialog.open(AlertDialogComponent, config);
    } else if(error['type'] === 1) {
      this.cognitoService.signOut(this.router.url);
    }
  }

}
