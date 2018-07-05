import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from '@angular/router';
import { HttpService } from '../../../../../../core/services/http.service';
import { environment } from '../../../../../../../environments/environment';

@Injectable()
export class TrackAdminService {
  videoData: Object;
  videoRenderData: Object;
  private subject = new Subject<any>();

  constructor(
    private httpService: HttpService
  ) {

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
      let trackId = route.params['track_id'];
      let videoId = route.params['step_id'];

      Promise.all([
        this.getVideo(videoId),
        this.getVideoRenderData(videoId)
      ]).then(
        ([files]) => {

          resolve();

        },
        reject
      );
    });
  }

  getVideo(videoId: string): Promise<any>
  {
    this.videoData = null;

    return new Promise((resolve, reject) => {
      let videoApi = environment['api'] + 'videos/';
      videoApi += videoId;

      this.httpService.get(videoApi, true)
        .subscribe((res: any) => {
          this.videoData = res;
          resolve(true);
        }, (error: any) => {
          resolve(false);
        });
    });
  }

  getVideoRenderData(videoId: string): Promise<any> {
    this.videoRenderData = null;

    return new Promise((resolve, reject) => {
      let videoRenderApi = environment['api'] + 'renderData/';
      videoRenderApi += videoId;

      this.httpService.get(videoRenderApi, true)
        .subscribe((res: any) => {console.log(res)
          this.videoRenderData = res;
          resolve(true);
        }, (error: any) => {
          resolve(false);
        });
    });
  }

  sendEvent(data: any) {
    this.subject.next({ data: data });
  }

  getEvent(): Observable<any> {
    return this.subject.asObservable();
  }
}