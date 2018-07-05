import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  HostListener,
  AfterViewChecked,
  OnDestroy
} from '@angular/core';
import {
  Router,
  ActivatedRoute,
  NavigationStart
} from '@angular/router';
import { VgAPI, VgStates } from 'videogular2/core';
import { TrackService } from '../track.service';
import { TrackAdminService } from './admin.service';
import { fabric } from 'fabric';
import { englishMapping, VideoChapter } from './model';
import { HttpService } from '../../../../../../core/services/http.service';
import { CognitoService } from '../../../../../../core/services/cognito.service';
import { environment } from '../../../../../../../environments/environment';
import { AlertDialogComponent } from '../../../../../../core/components/alert-dialog/alert-dialog.component';
import {
  MatDialog
} from '@angular/material';

@Component({
  selector: 'app-channel-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class ChannelAdminComponent implements OnInit, OnDestroy, AfterViewChecked {
  routeParamsSub: any;
  routeQueryParamsSub: any;
  videoCanvas: any;
  videoEditDoneSub: any;
  metaDataSub: any;
  seekSub: any;
  endedSub: any;

  videoSourceUrl: string;
  currentHandle: string;
  currentAdminType: string;

  currentTime: number;
  totalTime: number;
  timelineCounter: number;
  timeSpace: number;
  scrubberDownX: number;
  scrubRatio: number;
  scrubMinRatio: number;
  scrubMaxRatio: number;
  scrubStep: number;
  scrubWidth: number;
  videoEffectWidth: number;
  selectedChapter: number;
  handlesSize: number;
  canvasXRatio: number;
  canvasYRatio: number;
  videoRenderingWidth: number;
  videoRenderingHeight: number;
  scrubberLeftPercent: number;
  keyboardCounter: number;
  keyboardCounterLoaded: number;

  vgSlider: boolean;
  isSeeking: boolean;
  wasPlaying: boolean;
  drag: boolean;
  canvasShowHighlight: boolean;
  isRenderedVideoData: boolean;

  videoData: Object;
  videoRenderData: Object;

  videoStatusList: string[];
  timelines: string[];
  adminTypes: string[];
  chapters: VideoChapter[];
  effectActions: Object[];

  api:VgAPI;
  @ViewChild('srubberEl') srubberEl: ElementRef;
  @ViewChild('timelineEl') timelineEl: ElementRef;
  @ViewChild('effectCanvas') effectCanvas: ElementRef;
  @ViewChild('canvasWrapperEle') canvasWrapperEle: ElementRef;
  @ViewChild('scrbArea') scrbArea: ElementRef;

  @HostListener('document:mouseup', [ '$event' ])
  onMouseUpScrubBar($event: any) {
    if (this.api) {
      if (!this.api.isLive && this.vgSlider && this.isSeeking) {
        this.seekEnd();
      }
    }
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private trackService: TrackService,
    private trackAdminService: TrackAdminService,
    private httpService: HttpService,
    private cognitoService: CognitoService,
    private dialog: MatDialog
  ) {
    this.videoSourceUrl = '';
    this.currentHandle = '';
    this.currentAdminType = '';

    this.currentTime = 0;
    this.timeSpace = 0;
    this.timelineCounter = 8;
    this.selectedChapter = -1;

    this.scrubRatio = 1;
    this.scrubMinRatio = 0.2;
    this.scrubMaxRatio = 3;
    this.scrubStep = 0.2;
    this.scrubWidth = 100;
    this.videoEffectWidth = 100;
    this.handlesSize = 8;
    this.canvasXRatio = 0;
    this.canvasYRatio = 0;
    this.totalTime = 0;
    this.videoRenderingWidth = 1920;
    this.videoRenderingHeight = 1080;
    this.scrubberLeftPercent = 0;
    this.keyboardCounter = 0;
    this.keyboardCounterLoaded = 0;

    this.vgSlider = true;
    this.isSeeking = false;
    this.wasPlaying = false;
    this.drag = false;
    this.canvasShowHighlight = false;
    this.isRenderedVideoData = false;

    this.timelines = [];
    this.effectActions = [];
    this.adminTypes = ['text', 'effects', 'manuscript', 'quick_guide', 'speak'];
    this.videoStatusList = [VgStates.VG_PLAYING,  VgStates.VG_PAUSED];
    this.chapters = [];
    this.getVideoData();
  }

  ngOnInit() {
    // console.log(localStorage.getItem('trainingtube-currentuser-token'))
    this.routeParamsSub = this.route.params.subscribe(params => {

      if(this.routeQueryParamsSub) {
        this.routeQueryParamsSub.unsubscribe();
      }

      this.routeQueryParamsSub = this.route.queryParams.subscribe(queryParams => {
        this.trackService.emitTrackRouteChange({
          trackId: params['track_id'],
          stepId: params['step_id'],
          isAdmin: true,
          type: queryParams['type']
        });

        this.currentAdminType = queryParams['type'];
      });

    });

    this.videoEditDoneSub = this.trackService.videoEditDoneEmitted$.subscribe(emitData => {
      Promise.all([
        this.submitVideoRendering(),
        this.updateVideoData()
      ]).then(
        (res) => {
          let message = '';
          let isAuthorized = true;

          if(res && res.length > 0) {
            for(let i = 0; i <= 1; i ++) {
              let returnedData = this.checkVideoEditResponse(res[i]);
              if (!returnedData['isAuthorized']) {
                isAuthorized = false;
                this.cognitoService.signOut(this.router.url);
                break;
              } else {
                if(i === 1) {
                  message += '<br />';
                }

                if(returnedData['isSuccess']) {
                  message += '- Success: ';
                } else {
                  message += '- Error: ';
                }

                message += returnedData['message'];
              }
            }

            if (isAuthorized) {
              let config = {
                width: '400px',
                disableClose: false,
                data: {
                  type: 'info',
                  comment: message
                }
              };

              this.dialog.open(AlertDialogComponent, config);
              this.router.navigate([emitData]);
            }
          }
        },
        (error) => {
          console.log(error)
        }
      );
    });
  }

  ngOnDestroy() {
    if(this.routeParamsSub) {
      this.routeParamsSub.unsubscribe();
    }

    if(this.routeQueryParamsSub) {
      this.routeQueryParamsSub.unsubscribe();
    }

    if(this.videoEditDoneSub) {
      this.videoEditDoneSub.unsubscribe();
    }

    if(this.metaDataSub) {
      this.metaDataSub.unsubscribe();
    }

    if(this.seekSub) {
      this.seekSub.unsubscribe();
    }

    if(this.endedSub) {
      this.endedSub.unsubscribe();
    }
  }

  ngAfterViewChecked() {
    this.scrubberLeftPercent = this.getPercentage();
    this.cdRef.detectChanges();
  }

  checkVideoEditResponse(res: any) {
    let isSuccess = false;
    let isAuthorized = true;
    let message = '';

    if(res['type'] === 0) { // update video data
      if (res['status'] === 'success') {
        isSuccess = true;
        isAuthorized = true;
        message = 'Video update is successful';
      } else if (res['status'] === 'error') {
        if (res['errorType'] === 0) { // requied
          isSuccess = false;
          isAuthorized = true;
          message = 'You must input all the fields valid and required in video update';
        } else if (res['errorType'] === 1) { // unauthorized
          isAuthorized = false;
        }
      }
    } else {  // render video data
      if (res['status'] === 'success') {
        isSuccess = true;
        isAuthorized = true;
        message = 'Video render is successful';
      } else if (res['status'] === 'error') {
        if (res['errorType'] === 0) { // requied
          isSuccess = false;
          isAuthorized = true;
          message = 'You must input all the fields valid and required in video render';
        } else if (res['errorType'] === 1) { // unauthorized
          isAuthorized = false;
        }
      }
    }

    return {
      isSuccess: isSuccess,
      isAuthorized: isAuthorized,
      message: message
    };
  }

  getVideoData() {
    this.videoData = this.trackAdminService.videoData;
    this.videoRenderData = this.trackAdminService.videoRenderData;
    this.videoSourceUrl = this.videoData['data']['videoSrc'];
  }

  getChapterIndex(sources: any[] = [], tar: any, isStart: boolean = false) {
    for (let i = 0; i < sources.length; i ++) {
      if (isStart) {
        if (tar < sources[i]) {
          return i;
        }
      } else {
        if (tar <= sources[i]) {
          return i;
        }
      }
      
    }

    return -1;
  }

  mapVideoRenderData() {
    this.chapters = [];
    this.effectActions = [];
    let ratioX = this.videoRenderingWidth / this.videoCanvas.width;
    let ratioY = this.videoRenderingHeight / this.videoCanvas.height;

    if (this.videoRenderData && this.videoRenderData['data']) {
      // Blur
      if (this.videoRenderData['data']['effects'] && this.videoRenderData['data']['effects']['blur'].length > 0) {

        for (let i = 0; i < this.videoRenderData['data']['effects']['blur'].length; i ++) {
          let blur = this.videoRenderData['data']['effects']['blur'][i];
          this.onBlur(
            blur['x'] / ratioX,
            blur['y'] / ratioY,
            blur['width'] / ratioX,
            blur['height'] / ratioY
          );

          this.effectActions[this.effectActions.length - 1]['pos'] = blur['start'] / this.totalTime * 100;
          this.effectActions[this.effectActions.length - 1]['width'] = (blur['stop'] - blur['start']) / this.totalTime * 100;
        }

      }

      // Trim
      if (this.videoRenderData['data']['trim'].length > 0) {

        for (let i = 0; i < this.videoRenderData['data']['trim'].length; i ++) {
          let trim = this.videoRenderData['data']['trim'][i];
          this.onTrim();
          this.effectActions[this.effectActions.length - 1]['pos'] = trim['start'] / this.totalTime * 100;
          this.effectActions[this.effectActions.length - 1]['width'] = (trim['stop'] - trim['start']) / this.totalTime * 100;
        }

      }

      if (this.videoRenderData['data']['breakpoints'].length > 0) {
        let screenshots = this.videoRenderData['data']['quickGuide']['screenshots'];
        let chapterLength = this.videoRenderData['data']['breakpoints'].length;
        let endPoints = this.videoRenderData['data']['breakpoints'].map(function(item) {
          return item['end'];
        });

        // Quick guide
        for (let i = 0; i < chapterLength; i ++) {
          let defaultChapter = new VideoChapter(
            (i === 0)? 0 : endPoints[i-1] / this.totalTime * 100,
            (i === 0)? endPoints[i] / this.totalTime * 100 : (endPoints[i] - endPoints[i-1]) / this.totalTime * 100,
            -1,
            {
              guide: null,
              timeWidthP: 0
            }
          );
    
          this.chapters.push(defaultChapter);
          this.chapters[i]['transcript'] = this.videoRenderData['data']['breakpoints'][i]['transcription'];
          this.chapters[i]['manuscript'] = this.videoRenderData['data']['breakpoints'][i]['manuscript'];
        }

        let chapterIndex = 0;

        // Screenshots
        if (screenshots.length > 0) {
          for (let i = 0; i < screenshots.length; i ++) {
            chapterIndex = this.getChapterIndex(endPoints, screenshots[i]['start'], true);

            if (chapterIndex > -1) {
              let startPercent = screenshots[i]['start'] / this.totalTime * 100;
  
              this.chapters[chapterIndex]['activatedAction'] = -1;
              this.chapters[chapterIndex]['effects'] = {
                guide: {
                  text: screenshots[i]['text'],
                  canvasObject: this.addHighlight(
                    'purple',
                    screenshots[i]['x'] / ratioX,
                    screenshots[i]['y'] / ratioY,
                    screenshots[i]['width'] / ratioX,
                    screenshots[i]['height'] / ratioY
                  )
                },
                timeWidthP: 0
              };
            }

          }
        }

        // Effects
        let effects = this.videoRenderData['data']['effects'];

        if (effects) {
          if (effects['blur'] && effects['blur'].length > 0) {

          }

          // Circle
          if (effects['circle'] && effects['circle'].length > 0) {
            for (let c = 0; c < effects['circle'].length; c ++) {
              chapterIndex = this.getChapterIndex(endPoints, effects['circle'][c]['stop']);

              if (chapterIndex > -1) {
                let circleCanvas = this.addCircleCanvas(
                  'red',
                  effects['circle'][c]['x'] / ratioX,
                  effects['circle'][c]['y'] / ratioY,
                  effects['circle'][c]['width'] / ratioX,
                  effects['circle'][c]['height'] / ratioY
                );
                this.createNewEffect('circle', [{type: 'circle', canvas: circleCanvas}], chapterIndex);
                this.chapters[chapterIndex]['effects']['timeWidthP'] = (effects['circle'][c]['stop'] - effects['circle'][c]['start']) / this.totalTime * 100;
                this.chapters[chapterIndex]['activatedAction'] = 0;
              }
            }
          }

          // Highlight
          if (effects['highlight'] && effects['highlight'].length > 0) {
            for (let h = 0; h < effects['highlight'].length; h ++) {
              chapterIndex = this.getChapterIndex(endPoints, effects['highlight'][h]['stop']);

              if (chapterIndex > -1) {
                let highlighCanvas = this.addHighlight(
                  'blue',
                  effects['highlight'][h]['x'] / ratioX,
                  effects['highlight'][h]['y'] / ratioY,
                  effects['highlight'][h]['width'] / ratioX,
                  effects['highlight'][h]['height'] / ratioY
                );
                this.createNewEffect('highlight', [{type: 'rectange', canvas: highlighCanvas}], chapterIndex);
                this.chapters[chapterIndex]['effects']['timeWidthP'] = (effects['highlight'][h]['stop'] - effects['highlight'][h]['start']) / this.totalTime * 100;
                this.chapters[chapterIndex]['activatedAction'] = 1;
              }
            }
          }

          // Caption
          if (effects['caption'] && effects['caption'].length > 0) {
            for (let p = 0; p < effects['caption'].length; p ++) {
              chapterIndex = this.getChapterIndex(endPoints, effects['caption'][p]['stop']);

              if (chapterIndex > -1) {
                let highlighCanvas = this.addHighlight(
                  'blue',
                  effects['caption'][p]['x'] / ratioX,
                  effects['caption'][p]['y'] / ratioY,
                  effects['caption'][p]['width'] / ratioX,
                  effects['caption'][p]['height'] / ratioY
                );
                let captions = this.addCaptionCanvas(effects['caption'][p]['text']?effects['caption'][p]['text']:'');
                captions.push({type: 'rectangle', canvas: highlighCanvas});
                this.createNewEffect('caption', captions, chapterIndex);
                this.chapters[chapterIndex]['effects']['timeWidthP'] = (effects['caption'][p]['stop'] - effects['caption'][p]['start']) / this.totalTime * 100;
                this.chapters[chapterIndex]['activatedAction'] = 2;
              }
            }
          }

          // Keyboard
          if (effects['keyboard'] && effects['keyboard'].length > 0) {
            this.keyboardCounter = 0;
            this.keyboardCounterLoaded = 0;

            for (let k = 0; k < effects['keyboard'].length; k ++) {
              chapterIndex = this.getChapterIndex(endPoints, effects['keyboard'][k]['stop']);

              if (chapterIndex > -1) {
                this.keyboardCounter ++;

                this.addKeyboardCanvas(effects['keyboard'][k]['keys']).then((keyboards: any[]) => {
                  this.createNewEffect('keyboard', keyboards, chapterIndex);
                  this.chapters[chapterIndex]['effects']['timeWidthP'] = (effects['keyboard'][k]['stop'] - effects['keyboard'][k]['start']) / this.totalTime * 100;
                  this.chapters[chapterIndex]['activatedAction'] = 3;
                  this.keyboardCounterLoaded ++;
                });
              }
            }
          }
        }
      } else {
        let defaultChapter = new VideoChapter(0, 100, -1, {
          guide: null,
          timeWidthP: 0
        });
  
        this.chapters.push(defaultChapter);
      }
    }

    this.isRenderedVideoData = true;
    console.log(this.chapters)
    this.drawEffects();
  }

  videoDataChanged($event: any) {
    this.trackAdminService.videoData = $event;
    this.videoData = $event;
  }

  updateVideoData(): Promise<any> {
    return new Promise((resolve, reject) => {

      this.httpService.put(environment['api'] + 'videos/' + this.videoData['id'], this.videoData['data'], true)
        .subscribe((res: any) => {
          resolve({
            type: 0,
            status: 'success'
          });
        }, (error: any) => {
          resolve({
            type: 0,
            status: 'error',
            errorType: error['type']
          });
        });

    });
  }

  submitVideoRendering(): Promise<any> {
    return new Promise((resolve, reject) => {
      if(!this.videoCanvas) {
        resolve({
          type: 1,
          status: 'none'
        });
      } else {

        let trims = [];
        let blurs = [];
        let ratioX = this.videoRenderingWidth / this.videoCanvas.width;
        let ratioY = this.videoRenderingHeight / this.videoCanvas.height;
        
        if(this.effectActions.length > 0) {
          for(let i = 0; i < this.effectActions.length; i ++) {
            if(this.effectActions[i]['type'] === 'trim') {
              trims.push({
                start: this.effectActions[i]['pos'] / 100 * this.totalTime,
                stop: (this.effectActions[i]['pos'] + this.effectActions[i]['width']) / 100 * this.totalTime
              });
            } else if(this.effectActions[i]['type'] === 'blur') {
              let zoomX = this.effectActions[i]['canvas']['zoomX'] ? this.effectActions[i]['canvas']['zoomX'] : 1;
              let zoomY = this.effectActions[i]['canvas']['zoomY'] ? this.effectActions[i]['canvas']['zoomY'] : 1;

              blurs.push({
                start: this.effectActions[i]['pos'] / 100 * this.totalTime,
                stop: (this.effectActions[i]['pos'] + this.effectActions[i]['width']) / 100 * this.totalTime,
                x: this.effectActions[i]['canvas']['left'] * ratioX,
                y: this.effectActions[i]['canvas']['top'] * ratioY,
                width: this.effectActions[i]['canvas']['width'] * zoomX * ratioX,
                height: this.effectActions[i]['canvas']['height'] * zoomY * ratioY,
                fadeIn: false,
                fadeOut: false
              });
            }
          }
        }

        let breakpoints = [];
        let captions = [];
        let highlights = [];
        let circles = [];
        let guides = [];
        let keyboards = [];
        console.log('---chapters--');
        console.log(this.chapters)

        for(let i = 0; i < this.chapters.length; i ++) {
          breakpoints.push({
            end: (this.chapters[i]['startXP'] + this.chapters[i]['widthP']) / 100 * this.totalTime,
            transcription: this.chapters[i]['transcript'],
            manuscript: this.chapters[i]['manuscript']
          });

          if (this.chapters[i]['effects']['guide']) {
            let canvasItem = this.chapters[i]['effects']['guide']['canvasObject'];
            let zoomX = canvasItem['zoomX'] ? canvasItem['zoomX'] : 1;
            let zoomY = canvasItem['zoomY'] ? canvasItem['zoomY'] : 1;

            guides.push({
              text: this.chapters[i]['effects']['guide']['text'],
              start: this.chapters[i]['startXP'] / 100 * this.totalTime,
              x: canvasItem['left'] * ratioX,
              y: canvasItem['top'] * ratioY,
              width: canvasItem['width'] * zoomX * ratioX,
              height: canvasItem['height'] * zoomY * ratioY
            });
          }

          if(this.chapters[i]['effects']['configuration']) {
            switch (this.chapters[i]['effects']['configuration']['type']) {
              case 'caption':
                let x = 0;
                let y = 0;
                let width = 0;
                let height = 0;
                let text = '';
                let canvasItem;
                let zoomX = 1;
                let zoomY = 1;

                for(let j = 0; j < this.chapters[i]['effects']['configuration']['canvasObjects'].length; j ++) {
                  canvasItem = this.chapters[i]['effects']['configuration']['canvasObjects'][j];
                  zoomX = canvasItem['canvas']['zoomX'] ? canvasItem['canvas']['zoomX'] : 1;
                  zoomY = canvasItem['canvas']['zoomY'] ? canvasItem['canvas']['zoomY'] : 1;

                  if(canvasItem['type'] === 'rectangle') {
                    x = canvasItem['canvas']['left'] * ratioX;
                    y = canvasItem['canvas']['top'] * ratioY;
                    width = canvasItem['canvas']['width'] * zoomX * ratioX;
                    height = canvasItem['canvas']['height'] * zoomY * ratioY;
                  } else if(canvasItem['type'] === 'text') {
                    text = canvasItem['canvas']['text'];
                  }
                }

                captions.push({
                  start: this.chapters[i]['startXP'] / 100 * this.totalTime,
                  stop: (this.chapters[i]['startXP'] + this.chapters[i]['effects']['timeWidthP']) / 100 * this.totalTime,
                  text: text,
                  x: x,
                  y: y,
                  width: width,
                  height: height,
                  fadeIn: false,
                  fadeOut: false
                });
                break;

              case 'highlight':
                canvasItem = this.chapters[i]['effects']['configuration']['canvasObjects'][0];
                zoomX = canvasItem['canvas']['zoomX'] ? canvasItem['canvas']['zoomX'] : 1;
                zoomY = canvasItem['canvas']['zoomY'] ? canvasItem['canvas']['zoomY'] : 1;
                highlights.push({
                  start: this.chapters[i]['startXP'] / 100 * this.totalTime,
                  stop: (this.chapters[i]['startXP'] + this.chapters[i]['effects']['timeWidthP']) / 100 * this.totalTime,
                  x: canvasItem['canvas']['left'] * ratioX,
                  y: canvasItem['canvas']['top'] * ratioY,
                  width: canvasItem['canvas']['width'] * zoomX * ratioX,
                  height: canvasItem['canvas']['height'] * zoomY * ratioY,
                  fadeIn: false,
                  fadeOut: false
                });
                break;

              case 'circle':
                canvasItem = this.chapters[i]['effects']['configuration']['canvasObjects'][0];
                zoomX = canvasItem['canvas']['zoomX'] ? canvasItem['canvas']['zoomX'] : 1;
                zoomY = canvasItem['canvas']['zoomY'] ? canvasItem['canvas']['zoomY'] : 1;
                circles.push({
                  start: this.chapters[i]['startXP'] / 100 * this.totalTime,
                  stop: (this.chapters[i]['startXP'] + this.chapters[i]['effects']['timeWidthP']) / 100 * this.totalTime,
                  x: canvasItem['canvas']['left'] * ratioX,
                  y: canvasItem['canvas']['top'] * ratioY,
                  width: canvasItem['canvas']['width'] * zoomX * ratioX,
                  height: canvasItem['canvas']['height'] * zoomY * ratioY,
                  fadeIn: false,
                  fadeOut: false
                });
                break;

              case 'keyboard':
                let keyImageCanvas = this.chapters[i]['effects']['configuration']['canvasObjects'].filter((item: Object) => {
                  return item['type'] === 'keyImage';
                });

                keyboards.push({
                  language: (this.videoData['data'] && this.videoData['data']['language'])?this.videoData['data']['language'][0]:'en-UK',
                  keys: keyImageCanvas.length > 0?keyImageCanvas[0]['keys']:[],
                  start: this.chapters[i]['startXP'] / 100 * this.totalTime,
                  stop: (this.chapters[i]['startXP'] + this.chapters[i]['effects']['timeWidthP']) / 100 * this.totalTime,
                  fadeIn: false,
                  fadeOut: false
                });
              break;
            }
          }
        }

        let postData = {
          language: (this.videoData['data'] && this.videoData['data']['language'])?this.videoData['data']['language'][0]:'en-UK',
          service: 'Draft Screencast',
          videoId: this.videoData['id'],
          videoTitle: (this.videoData['data'] && this.videoData['data']['title'])?this.videoData['data']['title']:'',
          videoOriginal: (this.videoData['data'] && this.videoData['data']['videoSrc'])?this.videoData['data']['videoSrc']:'',
          voiceOverSrc: (this.videoData['data'] && this.videoData['data']['videoSrc'])?this.videoData['data']['videoSrc']:'',
          logoImg: 'https://s3-eu-west-1.amazonaws.com/tt-frontend/track_1_icon.png',
          breakpoints: breakpoints,
          trim: trims,
          effects: {
            circle: circles,
            highlight: highlights,
            blur: blurs,
            caption: captions,
            keyboard: keyboards
          },
          quickGuide: {
            copyright: "© Copyright 2018 Vestas Wind Systems All Rights Reserved | ID: VWSAB771ENG-1",
            color: "#004281",
            introduction: "<p>In this Quick Guide you will learn how to use the PO Output Monitor to follow up output messages in your Purchase Orders</p>",
            screenshots: guides
          }
        };

        console.log('--post data--')
        console.log(postData)

        if (this.videoRenderData) {
          this.httpService.put(environment['api'] + 'renderData/' + this.videoData['id'], postData, true)
            .subscribe((res: any) => {
              resolve({
                type: 1,
                status: 'success'
              });
            }, (error: any) => {
              resolve({
                type: 1,
                status: 'error',
                errorType: error['type']
              });
            });
        } else {
          this.httpService.post(environment['api'] + 'renderData?parent=' + this.videoData['id'], postData, true)
            .subscribe((res: any) => {
              resolve({
                type: 1,
                status: 'success'
              });
            }, (error: any) => {
              resolve({
                type: 1,
                status: 'error',
                errorType: error['type']
              });
            });
        }

      }
    });
  }

  /**
  * convert milliseconds from videogular, to time displayed
  */
  convertMilliseconds(milliseconds: number) {
    let time = '';
    let hours = Math.floor(milliseconds / 3600000);
    if(hours > 0) {
      time += hours;
      time += 'h';
    }

    let minutes = Math.floor(milliseconds / 60000);
    if(minutes > 0) {
      let val = minutes % 60;
      time += val;
      time += 'm';
    } else if(hours > 0) {
      time += '00m';
    }

    let seconds = Math.floor(milliseconds / 1000);
    if(seconds > 0) {
      let val = seconds % 60;
      time += val;
      time += 's';
    } else {
      time += '00s';
    }

    return time;
  }

  getVideoInformation() {
    this.timeSpace = this.api.time.total / this.timelineCounter;
    this.totalTime = this.api.time.total;
    this.calculateTimelines();
    this.initCanvas();
    this.mapVideoRenderData();
  }

  initCanvas() {
    let canvas = this.effectCanvas.nativeElement;
    canvas.width = this.canvasWrapperEle.nativeElement.offsetWidth;
    canvas.height = this.canvasWrapperEle.nativeElement.offsetHeight;
    this.videoCanvas = new fabric.Canvas('effect_canvas');
    this.videoCanvas.on('object:scaling', this.onCanvasObjectScaled);
  }

  onCanvasObjectScaled(e: any) {
    let modifiedObject = e.target;
    modifiedObject.strokeWidth = 3 / modifiedObject.scaleX;
  }

  addHighlight(
    stroke: string,
    left: number = this.canvasWrapperEle.nativeElement.offsetWidth / 2 - 35,
    top: number = this.canvasWrapperEle.nativeElement.offsetHeight / 2 - 35,
    width: number = 70,
    height: number = 70
  ) {
    let highlighCanvas = new fabric.Rect({
      left: left,
      top: top,
      width: width,
      height: height,
      fill: 'transparent',
      stroke: stroke,
      strokeWidth: 3,
      lockRotation: true
    });

    this.videoCanvas.add(highlighCanvas);
    return highlighCanvas;
  }

  addCircleCanvas(
    stroke: string,
    left: number = (this.canvasWrapperEle.nativeElement.offsetWidth / 2 - 40),
    top: number = (this.canvasWrapperEle.nativeElement.offsetHeight / 2 - 40),
    rx: number = 40,
    ry: number = 40
    ) {
    let circleCanvas = new fabric.Ellipse({
      left: left,
      top: top,
      rx: rx,
      ry: ry,
      fill: 'transparent',
      stroke: stroke,
      strokeWidth: 3,
      lockRotation: true,
      originX: 'center',
      originY: 'center'
    });

    this.videoCanvas.add(circleCanvas);
    return circleCanvas;
  }

  addCaptionCanvas(text: string) {
    
    let captionRectBgCanvas = new fabric.Rect({
      left: 0,
      top: this.canvasWrapperEle.nativeElement.offsetHeight - 60,
      width: this.canvasWrapperEle.nativeElement.offsetWidth,
      height: 60,
      fill: 'red',
      lockRotation: true,
      lockMovementX: true,
      lockMovementY: true,
      lockScalingX: true,
      lockScalingY: true,
      lockUniScaling: true
    });

    this.videoCanvas.add(captionRectBgCanvas);

    let captionTextCanvas = new fabric.Text(text, {
      left: this.canvasWrapperEle.nativeElement.offsetWidth / 2 - 30,
      top: this.canvasWrapperEle.nativeElement.offsetHeight - 40,
      fontSize: 20,
      fill: 'white',
      lockRotation: true,
      lockMovementX: true,
      lockMovementY: true,
      lockScalingX: true,
      lockScalingY: true,
      lockUniScaling: true
    });

    this.videoCanvas.add(captionTextCanvas);

    return [
      {type: 'background', canvas: captionRectBgCanvas},
      {type: 'text', canvas: captionTextCanvas}
    ];

  }

  addKeyboardCanvas(texts: string[]) {
    let keyboardImg = new Image();
    let imgURL = 'assets/images/etc/keyboard.png';
    let that = this;

    return new Promise((resolve, reject) => {
      keyboardImg.onload = function (img) {
        let scale = that.canvasWrapperEle.nativeElement.offsetWidth / 3 * 2 / keyboardImg.width;

        let keyboardCanvas = new fabric.Image(keyboardImg, {
          left: that.canvasWrapperEle.nativeElement.offsetWidth / 6,
          top: that.canvasWrapperEle.nativeElement.offsetHeight - scale * keyboardImg.height,
          scaleX: scale,
          scaleY: scale,
          lockRotation: true,
          lockMovementX: true,
          lockMovementY: true,
          lockScalingX: true,
          lockScalingY: true,
          lockUniScaling: true
        });

        that.videoCanvas.add(keyboardCanvas);
        let keyboardCircleCanvases = [];
        keyboardCircleCanvases.push({type: 'keyImage', canvas: keyboardCanvas, keys: texts});

        if(texts.length > 0) {

          for(let i = 0; i < texts.length; i++) {
            let text = texts[i];

            let ellipe = new fabric.Ellipse({
              left: that.canvasWrapperEle.nativeElement.offsetWidth / 6 + englishMapping[text][2] * scale,
              top: that.canvasWrapperEle.nativeElement.offsetHeight - scale * keyboardImg.height + englishMapping[text][3] * scale,
              rx: englishMapping[text][0] * scale / 2,
              ry: englishMapping[text][1] * scale / 2,
              fill: 'transparent',
              stroke: 'red',
              strokeWidth: 1,
              lockRotation: true,
              lockMovementX: true,
              lockMovementY: true,
              lockScalingX: true,
              lockScalingY: true,
              lockUniScaling: true,
              originX: 'center',
              originY: 'center'
            });

            keyboardCircleCanvases.push({type: 'ellipe', canvas: ellipe});
            that.videoCanvas.add(ellipe);
          }
        }

        resolve(keyboardCircleCanvases);
      };

      keyboardImg.src = imgURL;
    });
  }

  drawEffects() {
    if(this.api.time) {
      let currentTimeP = Number((this.api.time.current / this.api.time.total * 100).toFixed(2));
      let focusChapter = -1;
      this.videoCanvas.clear();

      for(let i = 0; i < this.chapters.length; i ++) {

        if(currentTimeP >= this.chapters[i]['startXP'] && 
          currentTimeP < (this.chapters[i]['widthP'] + this.chapters[i]['startXP'])) {
          focusChapter = i;
        }

      }

      if(focusChapter > -1) {
        let effects = this.chapters[focusChapter]['effects'];

        if (effects) {
          if (effects['guide'] && effects['guide']['canvasObject']) { // add quick guide blur effect
            this.videoCanvas.add(effects['guide']['canvasObject']);
          }
        }

        if(currentTimeP < (this.chapters[focusChapter]['startXP'] + effects['timeWidthP'] * this.chapters[focusChapter]['widthP'] / 100)) {

          if(effects['configuration']) {
            for(let j = 0; j < effects['configuration']['canvasObjects'].length; j ++) {
              this.videoCanvas.add(effects['configuration']['canvasObjects'][j]['canvas']);
            }
          }

        }
      }

    }
  }

  removeObjectCanvas(obj: any) {
    this.videoCanvas.remove(obj);
  }

  createNewEffect(type: string, canvasObjects: any[], chapterIndex: number) {
    this.chapters[chapterIndex]['effects']['configuration'] = {
      type: type,
      canvasObjects: canvasObjects
    };

    if (this.selectedChapter >= 0) {
      this.selectChapterEvent({
        chapterIndex: this.selectedChapter,
        startPercent: this.chapters[this.selectedChapter]['startXP']
      });
    }
  }

  removeSelectedChapterEffect() {
    if(this.chapters[this.selectedChapter]['effects']['configuration']) {
      for(let i = 0; i < this.chapters[this.selectedChapter]['effects']['configuration']['canvasObjects'].length; i ++) {
        this.removeObjectCanvas(this.chapters[this.selectedChapter]['effects']['configuration']['canvasObjects'][i]['canvas']);
      }

      this.chapters[this.selectedChapter]['effects']['configuration'] = null;
    }
  }

  createHightlight($event: any) {
    this.selectedChapter = $event['chapter'];
    this.removeSelectedChapterEffect();

    if($event.enable) {
      let highlighCanvas = this.addHighlight('blue');
      this.createNewEffect('highlight', [{type: 'rectange', canvas: highlighCanvas}], this.selectedChapter);
    }

    this.drawEffects();
  }

  createCircle($event: any) {
    this.selectedChapter = $event['chapter'];
    this.removeSelectedChapterEffect();

    if($event.enable) {
      let circleCanvas = this.addCircleCanvas('red');
      this.createNewEffect('circle', [{type: 'circle', canvas: circleCanvas}], this.selectedChapter);
    }

    this.drawEffects();
  }

  createCaption($event: any) {
    this.selectedChapter = $event['chapter'];
    if(this.selectedChapter < 0) {
      return;
    }

    this.removeSelectedChapterEffect();

    if($event.enable) {
      let highlighCanvas = this.addHighlight('blue');
      let captions = this.addCaptionCanvas($event['text']);
      captions.push({type: 'rectangle', canvas: highlighCanvas});
      this.createNewEffect('caption', captions, this.selectedChapter);
    }

    this.drawEffects();
  }

  createKeyboard($event: any) {
    this.selectedChapter = $event['chapter'];
    if(this.selectedChapter < 0) {
      return;
    }

    this.removeSelectedChapterEffect();

    if($event.enable) {
      let keys = this.getKeyboardLabelKeys($event['text']);
      this.addKeyboardCanvas(keys).then((keyboards: any[]) => {
        this.createNewEffect('keyboard', keyboards, this.selectedChapter);
      });
    }

    this.drawEffects();
  }

  deleteChapter($event: any) {
    if($event === 0) {
      this.chapters[1]['startXP'] = 0;
      this.chapters[1]['widthP'] += this.chapters[0]['widthP'];
    } else {
      this.chapters[$event-1]['widthP'] += this.chapters[$event]['widthP'];  
    }

    this.chapters.splice($event, 1);
    this.drawEffects();
  }

  getKeyboardLabelKeys(labels: string) {
    let keys = [];

    if(labels) {
      labels = labels.toLowerCase();
      keys = labels.split(' ');
      keys = keys.filter((item, pos) => {
        return (keys.indexOf(item) === pos) && englishMapping[item];
      });
    }
    return keys;
  }

  calculateTimelines() {
    let counter = (this.scrubRatio >= 1) ? Math.round(this.timelineCounter * this.scrubRatio) : Math.round(this.timelineCounter / this.scrubRatio);
    this.scrubWidth = Math.max(Math.round(100 * this.scrubRatio), 100);
    this.videoEffectWidth = (this.scrubRatio >= 1) ? 100 : 100 * this.scrubRatio;
    this.timelines = [];

    for (let i = 0; i <= counter; i ++) {
      if(this.scrubRatio > 1) {
        this.timelines[i] = this.convertMilliseconds(this.timeSpace  * i / this.scrubRatio);
      } else {
        this.timelines[i] = this.convertMilliseconds(this.timeSpace  * i);
      }
    }

    this.cdRef.detectChanges();
  }

  onPlayerReady(api:VgAPI) {
    this.api = api;

    this.metaDataSub = this.api.getDefaultMedia().subscriptions.loadedMetadata.subscribe(
      () => {
        this.getVideoInformation();
      });

    this.seekSub = this.api.getDefaultMedia().subscriptions.seeked.subscribe(
      () => {
        this.drawEffects();
      });

    this.endedSub = this.api.getDefaultMedia().subscriptions.ended.subscribe(
      () => {
        // Set the video to the beginning
        this.api.getDefaultMedia().currentTime = 0;
      });
  }

  onMouseDownScrubBar() {
    if (this.api) {
      if (!this.api.isLive) {
        this.seekStart();
      }
    }
  }

  onMouseMoveScrubBar($event: any) {

    if (this.api) {
      if (!this.api.isLive && this.vgSlider && this.isSeeking) {
        this.seekMove($event.offsetX);
      }
    }

  }

  //event function on changing srcub slider
  onChangeScrubSlider($event: any) {
    this.calculateTimelines();
    if(this.scrubWidth > 100) {
      this.scrbArea.nativeElement.scrollLeft = (this.scrubWidth - 100) / 100 * this.scrbArea.nativeElement.clientWidth * Number((this.api.time.current / this.api.time.total).toFixed(2));
    }
  }

  onPlay() {
    this.api.play();
  }

  onPause() {
    this.api.pause();
  }

  onRewind() {
    this.api.seekTime(((this.api.currentTime - 1) > 0 ) ? (this.api.currentTime - 1) : 0);

  }

  onForward() {
    this.api.seekTime(this.api.currentTime + 1); 
  }

  seekStart() {
    if (this.api.canPlay) {
      this.isSeeking = true;
      if (this.api.state === VgStates.VG_PLAYING) {
        this.wasPlaying = true;
      }
      this.api.pause();
    }
  }

  seekMove(offset: number) {

    if (this.isSeeking) {
      let percentage = Math.max(Math.min(offset / (this.timelineEl.nativeElement.scrollWidth - 20) * 100, 99.9), 0);

      if(this.scrubRatio < 1) {
        percentage /= this.scrubRatio;
      }

      this.api.time.current = percentage * this.api.time.total / 100;
      this.api.seekTime(percentage, true);
    }

  }

  seekEnd() {
    this.isSeeking = false;

    if (this.api.canPlay) {
      if (this.wasPlaying) {
        this.wasPlaying = false;
        this.api.play();
      }
    }
  }

  getPercentage() {
    if(!this.timelineEl) {
      return this.scrubberLeftPercent;
    }

    let ratio = (this.scrubRatio >= 1) ? 1 : this.scrubRatio;
    let timelineWidth = this.timelineEl.nativeElement.scrollWidth;
    return this.api ? ratio * (this.api.time.current / this.api.time.total * (timelineWidth - 20) / timelineWidth * 100) : 0;
  }

  selectChapterEvent($event: any) {
    this.selectedChapter = $event['chapterIndex'];
    let time = ($event && $event['startPercent']) ? $event['startPercent'] : 0;
    // time = (time * this.timelineEl.nativeElement.scrollWidth / 100 - 10) / (this.timelineEl.nativeElement.scrollWidth - 20) * 100;
    // time = (time > 0) ? time : 0;
    this.api.seekTime(Math.min(time, 99.99), true);
  }

  changeBlurEvent($event) {
    if ($event.status) {
      if (this.chapters[$event.index]['effects']['guide']) {
        this.chapters[$event.index]['effects']['guide']['canvasObject'] = this.addHighlight('purple');
      } else  {
        this.chapters[$event.index]['effects']['guide'] = {
          canvasObject: this.addHighlight('purple')
        };
      }
    } else {
      this.removeObjectCanvas(this.chapters[$event.index]['effects']['guide']['canvasObject']);
      this.chapters[$event.index]['effects']['guide']['canvasObject'] = null;
    }
  }

  selectConfigurationChapter($event: any) {
    this.selectedChapter = $event;
  }

  onBlur(
    left: number = this.canvasWrapperEle.nativeElement.offsetWidth / 2 - 35,
    top: number = this.canvasWrapperEle.nativeElement.offsetHeight / 2 - 35,
    width: number = 70,
    height: number = 70
  ) {
    let blurCanvas = new fabric.Rect({
      left: left,
      top: top,
      width: width,
      height: height,
      fill: 'transparent',
      stroke: 'blue',
      strokeWidth: 3,
      lockRotation: true
    });

    this.videoCanvas.add(blurCanvas);

    this.effectActions.push({
      type: 'blur',
      pos: Number((this.api.time.current / this.api.time.total * 100).toFixed(2)),
      width: 10,
      canvas: blurCanvas
    });
  }

  onTrim() {
    this.effectActions.push({
      type: 'trim',
      pos: Number((this.api.time.current / this.api.time.total * 100).toFixed(2)),
      width: 10
    });
  }
  
  onSplit() {
    this.trackAdminService.sendEvent({
      type: 'split',
      pos: Number((this.api.time.current / this.api.time.total * 100).toFixed(2))
    });
  }
}
