import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-manuscript',
  templateUrl: './manuscript.component.html',
  styleUrls: ['./manuscript.component.scss']
})
export class ManuscriptComponent implements OnInit, OnChanges {
  @Input() chapters: Object[];
  @Input() selectedChapter: number;
  @Input() chapterLength: number;
  @Output() selectChapterEvent = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges() {
  }

  onSelectChapter(index: number) {
    if(this.chapters[index]) {
      this.selectedChapter = index;

      this.selectChapterEvent.emit({
        chapter: index,
        startTimeP: this.chapters[index]['startXP']
      });
    } else {
      console.log('The chapter is not existed.');
    }
  }

  onChangeTranscript(index: number, value: string) {
    this.chapters[index]['transcript'] = value;
  }

  onChangeManuscript(index: number, value: string) {
    this.chapters[index]['manuscript'] = value;
  }

}
