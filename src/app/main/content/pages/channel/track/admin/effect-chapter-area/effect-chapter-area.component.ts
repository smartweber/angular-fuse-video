import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
  HostListener,
  Input,
  ElementRef,
  ChangeDetectorRef
} from '@angular/core';
import { ContextMenuService, ContextMenuComponent } from 'ngx-contextmenu';
import { VideoChapter } from '../model';
import { TrackAdminService } from '../admin.service';
import {
    MatDialog
} from '@angular/material';
import { AlertDialogComponent } from '../../../../../../../core/components/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-effect-chapter-area',
  templateUrl: './effect-chapter-area.component.html',
  styleUrls: ['./effect-chapter-area.component.scss']
})
export class EffectChapterAreaComponent implements OnInit {
  currentChapterIndex: number;
  currentSplitOffset: number;
  currentSelectedChapterWidth: number;
  currentHandlerIndex: number;
  mouseDownX: number;

  draggingCorner: boolean;

  @ViewChild('effectMenu') effectMenu: ContextMenuComponent;
  @ViewChild('effectArea') effectArea: ElementRef;
  @Input() selectedChapter: number;
  @Input() chapterIndex: number;
  @Input() chapters: VideoChapter[];
  @Output() selectChapterEvent = new EventEmitter();

  constructor(
    private contextMenuService: ContextMenuService,
    private trackAdminService: TrackAdminService,
    private dialog: MatDialog,
    private cdRef: ChangeDetectorRef
  ) {
    this.currentChapterIndex = -1;
    this.currentHandlerIndex = -1;
    this.draggingCorner = false;
  }

  ngOnInit() {
    this.trackAdminService.getEvent().subscribe((res: any) => {
      if(res['data']['type'] === 'split') {
        this.splitChapter(res['data']['pos']);
      }
    });
  }

  splitChapter(pos: number) {
    let chapterIndex = this.getCurrentChapter(pos);
    if((pos - this.chapters[chapterIndex]['startXP']) < 1) {
      let config = {
        width: '400px',
        disableClose: false,
        data: {
          comment: 'The split chapter is small',
          type: 'info'
        }
      };
      this.dialog.open(AlertDialogComponent, config);
      return;
    }

    let endXP = this.chapters[chapterIndex]['startXP'] + this.chapters[chapterIndex]['widthP'];
    this.chapters[chapterIndex]['widthP'] = pos - this.chapters[chapterIndex]['startXP'];
    let newChapter = new VideoChapter(pos, endXP - pos, -1, {
      guide: null,
      timeWidthP: 0
    });
    this.chapters.splice( chapterIndex + 1, 0, newChapter );
    if(this.selectedChapter >= 0) {
      this.selectedChapter ++;
    }
  }

  getCurrentChapter(pos: number) {
    for(let i = 0; i < this.chapters.length; i ++) {
      if(this.chapters[i]['startXP'] < pos && pos <= (this.chapters[i]['widthP'] + this.chapters[i]['startXP'])) {
        return i;
      }
    }

    return -1;
  }

  // splitChapter(offset: number, width: number) {
  //   if(width < 20) {  
  //     alert('Hey, it is so small.');
  //     return;
  //   }

  //   if(this.chapters[this.currentChapterIndex]) {
  //     let focusChapter = this.chapters[this.currentChapterIndex];
  //     let widthP = (width - offset) / width * focusChapter.widthP;
  //     this.chapters[this.currentChapterIndex].widthP = offset / width * focusChapter.widthP;
  //     let newChapter = new VideoChapter(focusChapter.startXP + focusChapter.widthP, widthP, -1);
  //     this.chapters.splice( this.currentChapterIndex + 1, 0, newChapter );
  //   }
  // }

  // onSplit() {
  //   this.splitChapter(this.currentSplitOffset, this.currentSelectedChapterWidth);
  // }

  onContextMenu($event: MouseEvent, chapter: VideoChapter, chapterIndex: number): void {
    // this.currentChapterIndex = chapterIndex;
    // this.currentSplitOffset = $event.offsetX;
    // this.currentSelectedChapterWidth = $event.srcElement.scrollWidth;
    
    // this.contextMenuService.show.next({
    //   // Optional - if unspecified, all context menu components will open
    //   contextMenu: this.effectMenu,
    //   event: $event,
    //   item: chapter
    // });
    // $event.preventDefault();
    // $event.stopPropagation();
  }

  onClickChapter($event: MouseEvent, chapterIndex: number) {
    this.currentChapterIndex = chapterIndex;
    this.currentSplitOffset = $event.offsetX;
  }

  onSelectChapter(i) {console.log(this.chapters)
    if(this.chapters[i]) {
      this.selectedChapter = i;

      this.selectChapterEvent.emit({
        startPercent: this.chapters[i].startXP,
        chapterIndex: i
      });
    } else {
      console.log('The chapter is not existed.');
    }
  }

  onMouseDownHandler($event: any, index: number) {
    this.draggingCorner = true;
    this.mouseDownX = $event.clientX;
    this.currentHandlerIndex = index;
  }

  onMouseMoveHandler($event: any) {
    if(this.draggingCorner) {
      let offsetX = $event.clientX - this.mouseDownX;
      offsetX = Number((offsetX / this.effectArea.nativeElement.clientWidth * 100).toFixed(2));
      let width = this.chapters[this.currentHandlerIndex]['widthP'];
      let start = this.chapters[this.currentHandlerIndex]['startXP'];
      let nextWidth = this.chapters[this.currentHandlerIndex+1]['widthP'];
      let nextStart = this.chapters[this.currentHandlerIndex+1]['startXP'];
      this.chapters[this.currentHandlerIndex]['widthP'] += offsetX;
      this.chapters[this.currentHandlerIndex+1]['startXP'] += offsetX;
      this.chapters[this.currentHandlerIndex+1]['widthP'] -= offsetX;

      if(this.chapters[this.currentHandlerIndex]['widthP'] < 1 || this.chapters[this.currentHandlerIndex+1]['widthP'] < 1) {
        this.chapters[this.currentHandlerIndex]['widthP'] = width;
        this.chapters[this.currentHandlerIndex]['startXP'] = start;
        this.chapters[this.currentHandlerIndex+1]['widthP'] = nextWidth;
        this.chapters[this.currentHandlerIndex+1]['startXP'] = nextStart;
      }
      this.mouseDownX = $event.clientX;
    }
  }

  onMouseUp() {
    this.draggingCorner = false;
  }

  onChangeWidthEvent($event: any) {
    this.chapters[$event['chapter']]['effects']['timeWidthP'] = $event['widthP'];
    this.cdRef.detectChanges();
  }

}
