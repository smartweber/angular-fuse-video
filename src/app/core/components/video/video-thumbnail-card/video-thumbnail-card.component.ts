import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-video-thumbnail-card',
  templateUrl: './video-thumbnail-card.component.html',
  styleUrls: ['./video-thumbnail-card.component.scss']
})
export class VideoThumbnailCardComponent implements OnInit {
  @Input() videoLink: string;
  @Input() videoThumbImageUrl: string;
  @Input() title: string;
  @Input() description: string;

  constructor() { }

  ngOnInit() {
  }

}
