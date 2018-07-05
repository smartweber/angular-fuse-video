import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { HttpService } from '../../../../../core/services/http.service';
import { environment } from '../../../../../../environments/environment';

@Injectable()
export class VideoService implements Resolve<any>
{
  onFilterChanged: Subject<any> = new Subject();
  onVideosChangeStarted: BehaviorSubject<any> = new BehaviorSubject([]);
  onVideosChanged: BehaviorSubject<any> = new BehaviorSubject([]);

  videos: Object[];
  originalVideos: Object[];

  filtersByFormat: string[];
  filtersByStatus: string[];
  filtersByType: string[];

  constructor(private httpService: HttpService)
  {
    this.filtersByFormat = [];
    this.filtersByStatus = [];
    this.filtersByType = [];
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
      let channelId = route.pathFromRoot[3].params['id'];

      Promise.all([
        this.getVideos(channelId)
      ]).then(
        ([files]) => {

          this.onFilterChanged.subscribe(filter => {
            this.filtersByFormat = filter['format'];
            this.filtersByStatus = filter['status'];
            this.filtersByType = filter['type'];
            this.onVideosChangeStarted.next(true);
            this.getVideos(channelId);
          });

          resolve();

        },
        reject
      );
    });
  }

  getVideos(channelId: string): Promise<any>
  {
    this.videos = [];
    this.originalVideos = [];

    return new Promise((resolve, reject) => {
      this.httpService.get(environment['api'] + 'query/video?tubeId=Sk0DkWraM&channelId=' + channelId, true)
        .subscribe((res: any) => {
          if(res && res['Items']) {
            this.videos = res['Items']
              .sort((a, b) => a.createdAt > b.createdAt);

            if(!this.videos) {
              this.videos = [];
            }

            this.originalVideos = this.videos;

            this.videos = this.videos
              .filter((item: any) => {
                let isFiltered = false;

                if (
                  this.filtersByFormat.length > 0 &&
                  item['data'] &&
                  item['data']['format'] &&
                  this.filtersByFormat.indexOf(item['data']['format']) >= 0
                ) {
                  isFiltered = true;
                } else if (
                  this.filtersByStatus.length > 0 &&
                  item['data'] &&
                  item['data']['status'] &&
                  this.filtersByStatus.indexOf(item['data']['status']) >= 0
                ) {
                  isFiltered = true;
                } else if (
                  this.filtersByType.length > 0 &&
                  item['data'] &&
                  item['data']['status'] &&
                  this.filtersByType.indexOf(item['data']['type']) >= 0
                ) {
                  isFiltered = true;
                } else if (
                  this.filtersByFormat.length === 0 &&
                  this.filtersByStatus.length === 0 &&
                  this.filtersByType.length === 0
                ) {
                  isFiltered = true;
                }

                return isFiltered;
              });
          }

          this.onVideosChanged.next(this.videos);
          resolve(this.videos);

        }, reject)
    });
  }

  search(query: string) {
    let queryProperties = ['abstract', 'format', 'title'];
    this.videos = [];

    if(this.originalVideos.length > 0) {

      for(let i = 0; i < this.originalVideos.length; i ++) {

        for(let j = 0; j < queryProperties.length; j ++) {
          let property = queryProperties[j];

          if(this.originalVideos[i]['data'][property] && this.originalVideos[i]['data'][property].indexOf(query) >= 0) {
            this.videos.push(this.originalVideos[i]);
            break;
          }
        }

      }

    }

    this.onVideosChanged.next(this.videos);
  }

}
