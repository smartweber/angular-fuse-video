import {
  Component,
  OnInit,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';
import {
  Router,
  ActivatedRoute,
  NavigationStart
} from '@angular/router';
import { ChannelService } from '../channel.service';
import { ChannelHomeService } from './channel-home.service';

@Component({
  selector: 'app-channel-home',
  templateUrl: './channel-home.component.html',
  styleUrls: ['./channel-home.component.scss']
})
export class ChannelHomeComponent implements OnInit, OnDestroy {
  channelId: string;
  channelAbstact: string;
  channelName: string;
  isFollow: boolean;
  isEdit: boolean;
  pageChangeSub: any;
  channelChangeSub: any;

  breadcrumbs: Object[];
  tracks: Object[];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private channelService: ChannelService,
    private channelHomeService: ChannelHomeService
  ) {
    this.isFollow = false;
    this.isEdit = false;
    this.channelAbstact = '';
    this.channelName = '';
    this.breadcrumbs = [];
    this.tracks = this.channelService.tracks;
  }

  ngOnInit() {
    this.getChannelData();

    this.pageChangeSub = this.channelHomeService.pageChangeEmitted$.subscribe((res: boolean) => {
      this.isEdit = res;

      if (!this.cdRef['destroyed']) {
        this.cdRef.detectChanges();
      }
    });

    this.channelChangeSub = this.channelService.changeChannelEmitted$.subscribe(() => {
      this.getChannelData();
    });


    // this.router.events.forEach((event) => {
    //   if(event instanceof NavigationStart) {
    //     this.getChannelId();
    //   }
    // });
  }

  ngOnDestroy() {
    if(this.pageChangeSub) {
      this.pageChangeSub.unsubscribe();
    }

    if(this.channelChangeSub) {
      this.channelChangeSub.unsubscribe();
    }
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

      if (!this.cdRef['destroyed']) {
        this.cdRef.detectChanges();
      }
    }
  }

  doneEditEvent() {
    this.channelHomeService.emitChange();
  }

}
