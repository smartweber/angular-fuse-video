import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { HttpService } from '../../../../core/services/http.service';
import { ChannelEventService } from '../../../../core/services/channel-event.service';
import { environment } from '../../../../../environments/environment';

@Injectable()
export class ChannelService implements Resolve<any>
{
  channelData: Object;
  tracks: Object[];
  changeChannelSource = new Subject<any>();
  changeChannelEmitted$ = this.changeChannelSource.asObservable();

  constructor(
    private httpService: HttpService,
    private channelEventService: ChannelEventService
  )
  {
    this.channelData = null;
    this.tracks = [];
  }

  /**
   * The Contacts App Main Resolver
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
  {
    return new Promise((resolve, reject) => {
      let channelId = route.params['id'];

      Promise.all([
        this.getChannel(channelId),
        this.getTracks(channelId)
      ]).then(
        ([files]) => {

          resolve();

        },
        reject
      );
    });
  }

  getChannel(channelId: string): Promise<any>
  {
    this.channelData = null;

    return new Promise((resolve, reject) => {
      this.httpService.get(environment['api'] + 'channels/' + channelId, true)
        .subscribe((res: any) => {
          this.channelData = res;
          this.channelEventService.changeEvent(this.channelData);
          this.changeChannelSource.next();
          resolve(this.channelData);
        }, reject)
    });
  }

  getTracks(channelId: string): Promise<any> {
    this.tracks = [];

    return new Promise((resolve, reject) => {
      this.httpService.get(environment['api'] + 'query/track?tubeId=Sk0DkWraM&channelId=' + channelId, true)
        .subscribe((res: any) => {
          if(res && res['Items']) {
            this.tracks = res['Items']
              .sort((a, b) => a.createdAt > b.createdAt);

            if(!this.tracks) {
              this.tracks = [];
            }
          }

          resolve(this.tracks);
        }, reject);
    });
  }

}
