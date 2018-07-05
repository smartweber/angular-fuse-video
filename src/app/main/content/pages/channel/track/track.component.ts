import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import {
  Router,
  ActivatedRoute,
  NavigationStart
} from '@angular/router';
import {
  MatDialog
} from '@angular/material';
import { ChannelService } from '../channel.service';
import { TrackService } from './track.service';
import { AlertDialogComponent } from '../../../../../core/components/alert-dialog/alert-dialog.component';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-channel-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.scss']
})
export class ChannelTrackComponent implements OnInit {
  trackId: string;
  stepId: string;
  editType: string;
  trackTitle: string;
  trackAbstract: string;
  trackBackground: string;
  channelId: string;
  channelName: string;
  channelAbstract: string;
  channelBackground: string;
  channelIcon: string;

  isFollow: boolean;
  isAdmin: boolean;
  isGetChannelData: boolean;

  breadcrumbs: Object[];
  tracks: Object[];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private channelService: ChannelService,
    private trackService: TrackService,
    private cdRef: ChangeDetectorRef,
    private dialog: MatDialog
  ) {
    this.isFollow = false;
    this.isGetChannelData = false;

    this.channelName = '';
    this.channelAbstract = '';
    this.trackTitle = '';
    this.trackAbstract = '';
    this.trackBackground = '';
    this.channelBackground = '';
    this.channelIcon = '';
    this.breadcrumbs = [];
    this.tracks = this.channelService.tracks;
  }

  ngOnInit() {
    this.getChannelData();

    this.router.events.forEach((event) => {
      if(event instanceof NavigationStart) {
        this.getChannelData();
      }
    });
  }

  getChannelData() {
    this.trackId = '';
    this.stepId = '';
    this.editType = '';
    this.isAdmin = false;
    let channelData = this.channelService.channelData;
    this.channelId = channelData['id'];
    this.breadcrumbs = [];

    if(channelData['data']) {
      this.channelName = channelData['data']['name'];
      this.channelAbstract = channelData['data']['abstact'];
      this.channelBackground = channelData['data']['background'];
      this.channelIcon = channelData['data']['icon'];
      this.trackBackground = this.channelBackground;
      this.trackTitle = this.channelName;
      this.trackAbstract = this.channelAbstract;

      this.breadcrumbs.push({
        url: '/pg/channel/' + this.channelId + '/home',
        label: channelData['data']['name']
      });

      this.breadcrumbs.push({
        url: '/pg/channel/' + this.channelId + '/tracks',
        label: 'Tracks'
      });

      if (!this.cdRef['destroyed']) {
        this.cdRef.detectChanges();
      }
    }

    this.isGetChannelData = true;
  }

  updateNavigationEvent(event: any, counter: number = 0) {
    if(counter > 50) {
      let config = {
        width: '400px',
        disableClose: false,
        data: {
          type: 'error',
          comment: 'Timeout to get channel data from api'
        }
      };
      this.dialog.open(AlertDialogComponent, config);
    } else if(!this.isGetChannelData) {
      counter ++;
      setTimeout(() => this.updateNavigationEvent(event, counter), 50);
    } else {
      this.isAdmin = event['isAdmin'];

      if(this.channelId && event) {
        this.breadcrumbs = [];
        this.trackTitle = this.channelName;
        this.trackAbstract = this.channelAbstract;
        this.trackBackground = this.channelBackground;

        this.breadcrumbs.push({
          url: '/pg/channel/' + this.channelId + '/home',
          label: this.channelName
        });

        // track
        if(event['trackLabel']) {
          this.trackId = event['trackId'];
          this.trackTitle = event['trackLabel'];
          this.trackAbstract = event['trackAbstract'];
          this.trackBackground = event['trackBackground'];
          let trackUrl = '/pg/channel/' + this.channelId + '/tracks/' + event['trackId'];

          this.breadcrumbs.push({
            url: trackUrl,
            label: event['trackLabel']
          });

          // step
          if(event['stepLabel']) {
            let stepUrl = trackUrl + '/' + event['stepId'];
            this.stepId = event['stepId']?event['stepId']:'';

            this.breadcrumbs.push({
              url: stepUrl,
              label: event['stepLabel']
            });

            // edit
            if(event['isAdmin']) {
              this.editType = event['type'];

              this.breadcrumbs.push({
                url: stepUrl + '/edit?type=' + event['type'],
                label: 'Edit'
              });
            }
          }

        }

        if (!this.cdRef['destroyed']) {
          this.cdRef.detectChanges();
        }
      }
    }

  }

  doneEditEvent($event: any) {
    this.trackService.emitVideoDoneChange($event);
  }

}
