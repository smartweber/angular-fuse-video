import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-effect-action-area',
  templateUrl: './effect-action-area.component.html',
  styleUrls: ['./effect-action-area.component.scss']
})
export class EffectActionAreaComponent implements OnInit, OnChanges {
  @Input() effectActionLength: number;
  @Input() effectActions: Object[];

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
  }

  onChangeWidthEvent($event: any) {
    if($event['chapter'] < this.effectActions.length) {
      this.effectActions[$event.chapter]['width'] = $event['widthP'];
      this.effectActions[$event.chapter]['pos'] = $event['leftP'];
    }
  }

}
