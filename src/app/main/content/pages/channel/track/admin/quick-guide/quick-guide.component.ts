import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-quick-guide',
  templateUrl: './quick-guide.component.html',
  styleUrls: ['./quick-guide.component.scss']
})
export class QuickGuideComponent implements OnInit {
  @Input() chapters: Object[];
  @Input() selectedChapter: number;
  @Input() chapterLength: number;
  @Output() selectChapterEvent = new EventEmitter();
  @Output() changeBlurEvent = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  onSelectChapter(index: number) {
    if(this.chapters[index]) {
      this.selectedChapter = index;

      this.selectChapterEvent.emit({
        chapterIndex: index,
        startPercent: this.chapters[index]['startXP']
      });
    } else {
      console.log('Invalid Chapter');
    }
  }

  onChangeBlur($event: any, index: number) {
    this.changeBlurEvent.emit({
      index: index,
      status: $event.checked
    });
  }

  onChangeGuide(index: number, value: string) {
    if (this.chapters[index]['effects']['guide']) {
      this.chapters[index]['effects']['guide']['text'] = value;
    } else {
      this.chapters[index]['effects']['guide'] = {
        text: value
      };
    }
  }

}
