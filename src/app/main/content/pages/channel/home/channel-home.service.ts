import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class ChannelHomeService {
  editDoneSource = new Subject<any>();
  editDoneEmitted$ = this.editDoneSource.asObservable();

  pageChangeSource = new BehaviorSubject<any>('');
  pageChangeEmitted$ = this.pageChangeSource.asObservable();

  constructor() {
  }

  emitChange() {
    this.editDoneSource.next();
  }

  emitPageChange(change: any) {
    this.pageChangeSource.next(change);
  }

}
