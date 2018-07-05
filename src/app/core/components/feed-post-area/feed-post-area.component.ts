import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-feed-post-area',
  templateUrl: './feed-post-area.component.html',
  styleUrls: ['./feed-post-area.component.scss']
})
export class FeedPostAreaComponent implements OnInit {
  @Input() isRoot:boolean;
  isShowPostBtn: boolean;

  complexItems = [
    {
      'name'  : 'Alice Freeman',
      'avatar': 'assets/images/avatars/alice.jpg',
      'message': 'started following you.',
      'time'   : '13 mins. ago'
    },
    {
      'name'  : 'Andrew Green',
      'avatar': 'assets/images/avatars/andrew.jpg',
      'message': 'sent you a message.',
      'time'   : 'June 10,2015'
    },
    {
      'name'  : 'Garry Newman',
      'avatar': 'assets/images/avatars/garry.jpg',
      'message': 'shared a public post with your group.',
      'time'   : 'June 9,2015'
    },
    {
      'name'  : 'Carl Henderson',
      'avatar': 'assets/images/avatars/carl.jpg',
      'message': 'wants to play Fallout Shelter with you.',
      'time'   : 'June 8,2015'
    },
    {
      'name'  : 'Jane Dean',
      'avatar': 'assets/images/avatars/jane.jpg',
      'message': 'started following you.',
      'time'   : 'June 7,2015'
    }
  ];

  constructor() {
    this.isShowPostBtn = false;
  }

  ngOnInit() {
  }

  getValue(event: any) {
    if(event) {
      this.isShowPostBtn = true;
    } else {
      this.isShowPostBtn = false;
    }
  }

  format(item:any) {
    // return item['value'].toUpperCase();
    return item['name'];
  }

}
