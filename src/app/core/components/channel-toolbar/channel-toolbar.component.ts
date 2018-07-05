import {
  Component,
  OnInit,
  Input,
  OnChanges,
  ChangeDetectorRef,
  Output,
  EventEmitter
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-channel-toolbar',
  templateUrl: './channel-toolbar.component.html',
  styleUrls: ['./channel-toolbar.component.scss']
})
export class ChannelToolbarComponent implements OnInit, OnChanges {
  @Input() channelId: string;
  @Input() trackId: string;
  @Input() stepId: string;
  @Input() type: string;
  @Input() pageName: string;
  @Input() isAdmin: boolean;
  @Output() doneEditEvent = new EventEmitter();
  
  channelUri: string;

  constructor(
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.generateChannelUri();
  }

  generateChannelUri() {
    this.channelId = this.channelId ? this.channelId : '';
    this.channelUri = '/pg/channel/' + this.channelId;
  }

  openTrackAdminPanel(panel: string) {
    if(this.trackId && this.stepId) {
      this.router.navigate([this.channelUri + '/tracks/' + this.trackId + '/' + this.stepId + '/edit'], { queryParams: { type: panel } });
    }
  }

  doneTrackEdit() {
    if(this.trackId && this.stepId) {
      this.doneEditEvent.emit(this.channelUri + '/tracks/' + this.trackId + '/' + this.stepId);
    }
  }

  openHomeAdminPanel() {
    this.router.navigate([this.channelUri + '/home/edit']);
  }

  doneHomeEdit() {
    this.doneEditEvent.emit();
  }

}
