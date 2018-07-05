import {
  Component,
  OnInit,
  HostListener,
  Input,
  ViewChild,
  ElementRef,
  OnChanges,
  Output,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'app-draggable-block',
  templateUrl: './draggable-block.component.html',
  styleUrls: ['./draggable-block.component.scss']
})
export class DraggableBlockComponent implements OnInit, OnChanges {
  px: number;
  draggingCorner: boolean;
  draggingWindow: boolean;
  resizer: Function;

  @Input() effectIndex: number;
  @Input() effectActionWidth: number;
  @Input() effectActionLeft: number;
  @Input() effectActionType: string;
  @Output() changeWidthEvent = new EventEmitter();
  @ViewChild('draggableEle') draggableEle: ElementRef;

  constructor() {
    this.px = 0;
    this.draggingCorner = false;
    this.draggingWindow = false;
  }

  ngOnInit() {
    
  }

  ngOnChanges() {
    this.init();
  }

  init() {
    if(!this.effectActionWidth) {
      this.changeWidthEvent.emit({
        widthP: 25,
        chapter: this.effectIndex
      });
    }
  }

  checkMoveable() {
    if(this.effectActionLeft < 0 || (this.effectActionLeft + this.effectActionWidth) > 100) {
      return false;
    }

    return true;
  }

  stopMoveEvent() {
    this.draggingWindow = false;
    this.draggingCorner = false;

    this.changeWidthEvent.emit({
      widthP: this.effectActionWidth,
      leftP: this.effectActionLeft,
      chapter: this.effectIndex
    });
  }

  onWindowPress(event: MouseEvent) {
    if(this.effectActionType === 'chapter') {
      return;
    }

    this.draggingWindow = true;
    this.px = event.clientX;
  }

  onWindowDrag(event: MouseEvent) {
    if (!this.draggingWindow) {
      return;
    }

    let offsetX = event.clientX - this.px;
    let lastX = this.effectActionLeft;
    offsetX = Number((offsetX / this.draggableEle.nativeElement.scrollWidth * 100).toFixed(2));
    this.effectActionLeft += offsetX;

    if(!this.checkMoveable()) {
      this.effectActionLeft = lastX;
    }
    this.px = event.clientX;
  }

  onWindowUp() {
    this.stopMoveEvent();
  }

  leftResizeClick(offsetX: number) {
    offsetX = Number((offsetX / this.draggableEle.nativeElement.scrollWidth * 100).toFixed(2));
    this.effectActionLeft += offsetX;
    this.effectActionWidth -= offsetX;
  }

  rightResizeClick(offsetX: number) {
    offsetX = Number((offsetX / this.draggableEle.nativeElement.scrollWidth * 100).toFixed(2));
    this.effectActionWidth += offsetX;
  }

  onCornerClick(event: MouseEvent, resizer?: Function) {
    this.draggingCorner = true;
    this.px = event.clientX;
    this.resizer = resizer;
    event.preventDefault();
    event.stopPropagation();
  }

  onCornerMove(event: MouseEvent) {
    if (!this.draggingCorner) {
      return;
    }

    let offsetX = event.clientX - this.px;
    let lastX = this.effectActionLeft;
    let pWidth = this.effectActionWidth;

    this.resizer(offsetX);
    if(!this.checkMoveable()) {
      this.effectActionLeft = lastX;
      this.effectActionWidth = pWidth;
    }
    this.px = event.clientX;
  }

  @HostListener('document:mouseup', ['$event'])
  onCornerRelease(event: MouseEvent) {
    if (!this.draggingCorner) {
      return;
    }

    this.stopMoveEvent();
  }

}
