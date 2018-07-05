import {
  Component,
  Input,
  OnChanges,
  Output,
  EventEmitter,
  ChangeDetectorRef
} from '@angular/core';
import {
  Router,
  ActivatedRoute
} from '@angular/router';
import {
  MatDialog
} from '@angular/material';
import { TrackService } from '../../track.service';
import { HttpService } from '../../../../../../../core/services/http.service';
import { CognitoService } from '../../../../../../../core/services/cognito.service';
import { AlertDialogComponent } from '../../../../../../../core/components/alert-dialog/alert-dialog.component';
import { environment } from '../../../../../../../../environments/environment';

@Component({
    selector   : 'track-main-sidenav',
    templateUrl: './main-sidenav.component.html',
    styleUrls  : ['./main-sidenav.component.scss']
})
export class MainTrackSidenavComponent implements OnChanges
{
  currentTrack: string;
  currentStep: number;
  isGetVideos: boolean;
  isCompletedNavigationEmit: boolean;
  isEmit: boolean;
  emitData: any;
  videos: Object[];

  @Input() channelId: string;
  @Input() channelName: string;
  @Input() trackId: string;
  @Input() stepId: string;
  @Input() tracks: Object[];
  @Output() updateNavigationEvent = new EventEmitter();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private trackService: TrackService,
    private httpService: HttpService,
    private cognitoService: CognitoService,
    private cdRef: ChangeDetectorRef,
    private dialog: MatDialog
  )
  {
    this.currentTrack = '';
    this.currentStep = -1;
    this.isGetVideos = false;
    this.isCompletedNavigationEmit = false;
    this.isEmit = false;
    this.videos = [];
  }

  ngOnInit() {
    this.changeNavigation({
      trackId: this.trackId,
      stepId: this.stepId
    }, false);

    if (!this.cdRef['destroyed']) {
      this.cdRef.detectChanges();
    }

    this.trackService.trackChangeRouteEmitted$.subscribe(emitData => {
      this.changeNavigation(emitData);
    });
  }

  ngOnChanges() {
    
  }

  getTrackVideos(channelId: string, trackId: string) {
    this.videos = [];
    let videoApi = environment['api'] + 'query/video?tubeId=Sk0DkWraM&channelId=';
    videoApi += channelId;
    videoApi += '&trackId=';
    videoApi += trackId;

    this.httpService.get(videoApi, true)
      .subscribe((res: any) => {
        if(res['Items'] && res['Items'].length > 0) {
          res['Items'].sort((a, b) => a['data']['title'] > b['data']['title']);
          this.videos = res['Items'];
        }

        if(!this.videos) {
          this.videos = [];
        }

        if(this.stepId) {
          let stepCounter = 0;

          for(let video of this.videos) {

            if(video['id'] && video['id'] === this.stepId) {
              this.currentStep = stepCounter;
              break;
            }

            stepCounter ++;
          }
        }

        this.isGetVideos = true;
        if(this.emitData && this.isEmit) {
          this.changeNavigation(this.emitData);
          this.isEmit = false;
          this.emitData = null;
        }
      }, (error: any) => {
        this.alertError(error);
      });
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

  changeNavigation(navigationData: Object, isEmit: boolean = true) {
    this.isEmit = isEmit;
    this.currentTrack = '';
    this.currentStep = -1;
    let trackId = '';
    let trackLabel = '';
    let trackAbstract = '';
    let trackBackground = '';
    let stepLabel = '';
    let stepId = '';
    let type = '';

    let isAdmin = false;

    if(navigationData) {

      trackId = navigationData['trackId'];
      stepId = navigationData['stepId'];
      
      if(trackId) {

        let currentTracks = this.tracks.filter((item: Object) => item['id'] === trackId);
        if(currentTracks && currentTracks.length > 0) {
          trackLabel = (currentTracks[0]['data'] && currentTracks[0]['data']['name'])?currentTracks[0]['data']['name']:'';
          trackAbstract = (currentTracks[0]['data'] && currentTracks[0]['data']['abstract'])?currentTracks[0]['data']['abstract']:'';
          trackBackground = (currentTracks[0]['data'] && currentTracks[0]['data']['background'])?currentTracks[0]['data']['background']:'';
          this.currentTrack = currentTracks[0]['id'];
        }

        if(stepId) {
          let stepCounter = 0;
          this.stepId = stepId;

          for(let video of this.videos) {

            if(video['id'] && video['id'] === stepId) {
              stepLabel = (video['data'] && video['data']['title'])?video['data']['title']:'';
              this.currentStep = stepCounter;
              break;
            }

            stepCounter ++;
          }
        }
      }

      if(navigationData.hasOwnProperty('isAdmin') && navigationData['isAdmin']) {
        isAdmin = true;
        type = navigationData['type'];
      }

    }

    if (!this.cdRef['destroyed']) {
      this.cdRef.detectChanges();
    }

    if(isEmit) {
      this.emitData = navigationData;

      this.updateNavigationEvent.emit({
        trackId: trackId,
        trackLabel: trackLabel,
        trackAbstract: trackAbstract,
        trackBackground: trackBackground,
        stepId: stepId,
        stepLabel: stepLabel,
        isAdmin: isAdmin,
        type: type
      });
    }
  }

  openTrack(track: Object) {
    this.currentTrack = track['id'];
    this.currentStep = -1;
    this.isGetVideos = false;
    this.getTrackVideos(this.channelId, this.currentTrack);
  }

  gotoStep(step: number, id: string) {
    this.currentStep = step;
    this.router.navigate([this.currentTrack, id], { relativeTo: this.route });
  }
}
