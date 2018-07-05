import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'custom-video-player-card',
  templateUrl: './video-player-card.component.html',
  styleUrls: ['./video-player-card.component.scss']
})
export class CustomVideoPlayerCardComponent implements OnInit {
  types: string[];

  @Input() videoUrl: string;
  @Input() thumbnailUrl: string;
  @Input() thumbnailTitle: string;
  @Input() title: string;
  @Input() description: string;
  @Input() type: string;

  constructor() {
    this.types = ['player', 'thumbnail'];
  }

  ngOnInit() {
    if (!this.thumbnailTitle) {
      this.thumbnailTitle = 'Thumbnail';
    }
  }
}
