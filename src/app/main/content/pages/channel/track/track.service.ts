import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class TrackService {
  emitChangeSource = new Subject<any>();
  changeRouterEmitted$ = this.emitChangeSource.asObservable();

  trackRouteChangeSource = new Subject<any>();
  trackChangeRouteEmitted$ = this.trackRouteChangeSource.asObservable();

  videoEditDoneSource = new Subject<any>();
  videoEditDoneEmitted$ = this.videoEditDoneSource.asObservable();

  constructor() {
  }

  emitChange(change: any) {
    this.emitChangeSource.next(change);
  }

  emitTrackRouteChange(change: any) {
    this.trackRouteChangeSource.next(change);
  }

  emitVideoDoneChange(change: any) {
    this.videoEditDoneSource.next(change);
  }

}
