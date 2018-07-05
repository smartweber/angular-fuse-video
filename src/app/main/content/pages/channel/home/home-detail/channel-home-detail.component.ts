import { Component, OnInit } from '@angular/core';
import { ChannelHomeService } from '../channel-home.service';

@Component({
  selector: 'app-channel-home-detail',
  templateUrl: './channel-home-detail.component.html',
  styleUrls: ['./channel-home-detail.component.scss']
})
export class ChannelHomeDetailComponent implements OnInit {
  currentVideoUrl: string;
  videoLink: string;
  importants: number[];

  constructor(
    private channelHomeService: ChannelHomeService
  ) {
    this.currentVideoUrl = 'https://new-api.virtualevaluator.net/explainer.mp4';
    this.importants = [0, 1, 2];
  }

  ngOnInit() {
    this.createPageLink('develop_angular', 'track_b', 'introduction');
    this.channelHomeService.emitPageChange(false);
  }

  ngOnDestroy() {
  }

  createPageLink(channelId: string, trackId: string, stepId: string) {
    this.videoLink = '/pg/channel/' + channelId;
    this.videoLink += '/tracks/';
    this.videoLink += trackId;
    this.videoLink += '/';
    this.videoLink += stepId;
  }

}
