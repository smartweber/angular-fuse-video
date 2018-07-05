import { Component, Input } from '@angular/core';
import {
  Router,
  ActivatedRoute
} from '@angular/router';
import {
  MatDialog
} from '@angular/material';
import { HttpService } from '../../../../../../../core/services/http.service';
import { CognitoService } from '../../../../../../../core/services/cognito.service';
import { AlertDialogComponent } from '../../../../../../../core/components/alert-dialog/alert-dialog.component';
import { environment } from '../../../../../../../../environments/environment';


@Component({
    selector   : 'channel-home-main-sidenav',
    templateUrl: './main-sidenav.component.html',
    styleUrls  : ['./main-sidenav.component.scss']
})
export class MainChannelHomeSidenavComponent
{
  currentTrack: string;
  currentStep: number;
  isGetVideos: boolean;
  videos: Object[];

  @Input() channelName: string;
  @Input() channelId: string;
  @Input() tracks: Object[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpService: HttpService,
    private cognitoService: CognitoService,
    private dialog: MatDialog
  )
  {
    this.currentTrack = '';
    this.currentStep = -1;
    this.isGetVideos = false;
    this.videos = [];
  }

  ngOnInit() {}

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

        this.isGetVideos = true;
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

  openTrack(track: Object) {
    this.currentTrack = track['id'];
    this.currentStep = -1;
    this.isGetVideos = false;
    this.getTrackVideos(this.channelId, this.currentTrack);
  }

  gotoStep(step: number, id: string) {
    this.currentStep = step;
    let url = '/pg/channel/';
    url += this.channelId;
    url += '/tracks/';
    url += this.currentTrack;
    url += '/';
    url += id;
    this.router.navigate([url]);
  }

}
