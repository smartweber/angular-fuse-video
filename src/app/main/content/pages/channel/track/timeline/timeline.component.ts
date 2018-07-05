import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../profile.service';
import { fuseAnimations } from '../../../../../../core/animations';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {
  timeline: any;
  complexItems = [
    {
      "value" : "user1",
      "email": "user1@domain.com",
      "name": "User One"
    },
    {
      "value" : "user2",
      "email": "user2@domain.com",
      "name": "User Two"
    },
    {
      "value" : "user3",
      "email": "user3@domain.com",
      "name": "User Three"
    }
  ];

  constructor(private profileService: ProfileService)
  {
    this.profileService.timelineOnChanged.subscribe(timeline => {
      this.timeline = timeline;
    });
  }

  ngOnInit()
  {

  }

  format(item:any) {
    return item['value'].toUpperCase();
  }

}
