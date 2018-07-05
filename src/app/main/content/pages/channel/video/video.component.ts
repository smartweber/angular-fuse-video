import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import { fuseAnimations } from '../../../../../core/animations';
import {
  Router,
  ActivatedRoute,
  NavigationStart
} from '@angular/router';
import {
  MatDialog
} from '@angular/material';
import { VideoService } from './video.service';
import { ChannelService } from '../channel.service';
import { AlertDialogComponent } from '../../../../../core/components/alert-dialog/alert-dialog.component';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
  animations   : fuseAnimations
})
export class VideoComponent implements OnInit {
  isFollow: boolean;

  channelId: string;
  channelAbstact: string;
  channelName: string;
  breadcrumbs: Object[];
  videos: Object[];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private videoService: VideoService,
    private channelService: ChannelService,
    private cdRef: ChangeDetectorRef,
    private dialog: MatDialog
  ) {
    this.channelName = '';
    this.isFollow = false;
    this.breadcrumbs = [];
    this.videos = [];
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
    let channelData = this.channelService.channelData;
    this.channelId = channelData['id'];
    this.breadcrumbs = [];

    if(channelData['data']) {
      this.channelName = channelData['data']['name'];
      this.channelAbstact = channelData['data']['abstact'];

      this.breadcrumbs.push({
        url: '/pg/channel/' + this.channelId + '/home',
        label: channelData['data']['name']
      });

      this.breadcrumbs.push({
        url: '/pg/channel/' + this.channelId + '/videos',
        label: 'Videos'
      });

      if (!this.cdRef['destroyed']) {
        this.cdRef.detectChanges();
      }
    }
  }

}
