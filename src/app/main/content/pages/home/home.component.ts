import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentVideoUrl: string;
  videoLink: string;

  importants: number[];
  fovorites: number[];

  constructor(
  ) {
    this.currentVideoUrl = 'https://new-api.virtualevaluator.net/explainer.mp4';
    this.importants = [0, 1, 2, 3];
    this.fovorites = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  }

  ngOnInit() {
    this.createPageLink('develop_angular', 'track_b', 'introduction');
  }

  createPageLink(channelId: string, trackId: string, stepId: string) {
    this.videoLink = '/pg/channel/' + channelId;
    this.videoLink += '/tracks/';
    this.videoLink += trackId;
    this.videoLink += '/';
    this.videoLink += stepId;
  }

}
