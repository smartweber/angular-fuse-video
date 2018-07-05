import {
  Component,
  OnDestroy,
  Input,
  OnInit,
  OnChanges,
  ChangeDetectorRef
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { fuseAnimations } from '../../../../../../../core/animations';
import { VideoService } from '../../video.service';

@Component({
  selector: 'app-video-main-sidenav',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  animations : fuseAnimations
})
export class VideoMainSideNavComponent implements OnDestroy, OnInit, OnChanges
{
  isInprogress: boolean;
  onVideosChangedSubscription: Subscription;
  onVideosChangeStartedSubscription: Subscription;
  formats: Object[];
  statuses: Object[];
  types: Object[];
  originalVideos: Object[];
  filtersByFormat: string[];
  filtersByStatus: string[];
  filtersByType: string[];

  formatsChecked: Object;
  statusesChecked: Object;
  typesChecked: Object;

  constructor(
    private videoService: VideoService,
    private cdRef: ChangeDetectorRef
  )
  {
    this.formats = [];
    this.statuses = [];
    this.types = [];
    this.originalVideos = [];
    this.filtersByFormat = [];
    this.filtersByStatus = [];
    this.filtersByType = [];
    this.formatsChecked = {};
    this.statusesChecked = {};
    this.typesChecked = {};
    this.isInprogress = false;
  }

  ngOnInit() {
    this.onVideosChangeStartedSubscription =
      this.videoService.onVideosChangeStarted.subscribe(res => {
        this.isInprogress = true;
        if (!this.cdRef['destroyed']) {
          this.cdRef.detectChanges();
        }
      });

    this.onVideosChangedSubscription =
      this.videoService.onVideosChanged.subscribe(videos => {
        this.originalVideos = this.videoService.originalVideos;
        this.getFilters();
        this.isInprogress = false;
        if (!this.cdRef['destroyed']) {
          this.cdRef.detectChanges();
        }
      });
  }

  ngOnChanges() {
    
  }

  ngOnDestroy()
  {
    if(this.onVideosChangedSubscription) {
      this.onVideosChangedSubscription.unsubscribe();
    }
  }

  getFilters() {

    this.formats = [];
    this.statuses = [];
    this.types = [];

    if(this.originalVideos.length > 0) {
      for(let i = 0; i < this.originalVideos.length; i ++) {

        if (this.originalVideos[i]['data']) {

          if(this.originalVideos[i]['data']['format']) {
            let formatLables = this.formats.map(function(item) {
              return item['label'];
            });

            let index = formatLables.indexOf(this.originalVideos[i]['data']['format']);

            if (index < 0) {
              this.formats.push({
                label: this.originalVideos[i]['data']['format'],
                count: 1
              });
            } else {
              this.formats[index]['count'] ++;
            }
          }

          if(this.originalVideos[i]['data']['status']) {
            let statusLables = this.statuses.map(function(item) {
              return item['label'];
            });

            let index = statusLables.indexOf(this.originalVideos[i]['data']['status']);

            if (index < 0) {
              this.statuses.push({
                label: this.originalVideos[i]['data']['status'],
                count: 1
              });
            } else {
              this.statuses[index]['count'] ++;
            }
          }

          if(this.originalVideos[i]['data']['type']) {
            let typeLables = this.types.map(function(item) {
              return item['label'];
            });

            let index = typeLables.indexOf(this.originalVideos[i]['data']['type']);

            if (index < 0) {
              this.types.push({
                label: this.originalVideos[i]['data']['type'],
                count: 1
              });
            } else {
              this.types[index]['count'] ++;
            }
          }

        }

      }
    }

  }

  getValuesFiltered() {
    this.filtersByFormat = [];
    this.filtersByStatus = [];
    this.filtersByType = [];

    for (let key in this.formatsChecked) {
      if(this.formatsChecked[key]) {
        this.filtersByFormat.push(key);
      }
    }

    for (let key in this.statusesChecked) {
      if(this.statusesChecked[key]) {
        this.filtersByStatus.push(key);
      }
    }

    for (let key in this.typesChecked) {
      if(this.typesChecked[key]) {
        this.filtersByType.push(key);
      }
    }

    this.videoService.onFilterChanged.next({
      format: this.filtersByFormat,
      status: this.filtersByStatus,
      type: this.filtersByType
    });
  }

  filterByAll() {
    this.formatsChecked = {};
    this.statusesChecked = {};
    this.typesChecked = {};
    this.getValuesFiltered();
  }

  changeFormatFiltered($event: any, filter: string)
  {
    this.formatsChecked[filter] = $event['checked'];
    this.getValuesFiltered();
  }

  changeStatusFiltered($event: any, filter: string)
  {
    this.statusesChecked[filter] = $event['checked'];
    this.getValuesFiltered();
  }

  changeTypeFiltered($event: any, filter: string)
  {
    this.typesChecked[filter] = $event['checked'];
    this.getValuesFiltered();
  }

}

