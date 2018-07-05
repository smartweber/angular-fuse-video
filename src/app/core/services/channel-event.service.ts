import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class ChannelEventService {
  channelEventSource: BehaviorSubject<Object> = new BehaviorSubject(null);
  channelDataChaned = this.channelEventSource.asObservable();

  constructor() { }

  changeEvent(data: Object) {
    this.channelEventSource.next(data)
  }

}
