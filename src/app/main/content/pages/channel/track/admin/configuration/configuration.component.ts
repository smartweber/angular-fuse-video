import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  SimpleChange,
  ChangeDetectorRef
} from '@angular/core';

@Component({
  selector: 'app-channel-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ChannelConfigurationComponent implements OnInit, OnChanges {
  captionSlider: boolean;
  keyboardSlider: boolean;
  captions: string[];
  keyboards: string[];

  @Input() chapters: Object[];
  @Input() chapterLength: number;
  @Input() selectedChapter: number;
  @Output() selectConfigurationChapter = new EventEmitter();
  @Output() createHightlight = new EventEmitter();
  @Output() createCircle = new EventEmitter();
  @Output() createCaption = new EventEmitter();
  @Output() createKeyboard = new EventEmitter();
  @Output() deleteChapter = new EventEmitter();

  constructor(
    private cdRef: ChangeDetectorRef
  ) {
    this.captions = [];
    this.keyboards = [];
    this.keyboardSlider = false;
  }

  ngOnInit() {
    
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['chapterLength'] || changes['chapters']) {
      this.init();
      this.cdRef.detectChanges();
    }
  }

  init() {
    this.captions = [];
    this.keyboards = [];

    for(let i = 0; i < this.chapters.length; i ++) {
      if (this.chapters[i]['effects']['configuration'] && this.chapters[i]['effects']['configuration']['type'] === 'caption') {
        for (let j = 0; j < this.chapters[i]['effects']['configuration']['canvasObjects'].length; j ++) {
          let canvasObject = this.chapters[i]['effects']['configuration']['canvasObjects'][j];

          if (canvasObject['type'] === 'text') {
            this.captions.push(canvasObject['canvas']['text']);
            break;
          }
        }

        if (this.captions.length < (i + 1)) {
          this.captions.push('');  
        }
      } else {
        this.captions.push('');
      }

      if (this.chapters[i]['effects']['configuration'] && this.chapters[i]['effects']['configuration']['type'] === 'keyboard') {
        let keyImageCanvas = this.chapters[i]['effects']['configuration']['canvasObjects'].filter((item: Object) => {
          return item['type'] === 'keyImage';
        });

        if (keyImageCanvas.length > 0) {
          this.keyboards.push(keyImageCanvas[0]['keys'].join(' '));
        } else {
          this.keyboards.push('');
        }
      }
    }
  }

  checkActionActivated(event: any, index: number, actionNumber: number) {
    this.chapters[index]['activatedAction'] = -1;
    if(event.checked) {
      this.chapters[index]['activatedAction'] = actionNumber;
    }
  }

  onSelectChapter(index: number) {
    this.selectedChapter = index;
    this.selectConfigurationChapter.emit(index);
  }

  onChangeCircle(event: any, index: number) {
    this.checkActionActivated(event, index, 0);
    this.selectedChapter = index;

    this.createCircle.emit({
      enable: event.checked,
      chapter: index
    });

  }

  onChangeHightlight(event: any, index: number) {
    this.checkActionActivated(event, index, 1);
    this.selectedChapter = index;

    this.createHightlight.emit({
      enable: event.checked,
      chapter: index
    });
  }

  onChangeCaptionSlider(event: any, index: number) {
    this.checkActionActivated(event, index, 2);
    this.selectedChapter = index;
    this.captionSlider = event.checked;

    this.createCaption.emit({
      enable: event.checked,
      chapter: index,
      text: this.captions[index]?this.captions[index]:''
    });
  }

  onChangeKeyboardSlider(event: any, index: number) {
    this.checkActionActivated(event, index, 3);
    this.selectedChapter = index;
    this.captionSlider = event.checked;

    this.createKeyboard.emit({
      enable: event.checked,
      chapter: index,
      text: this.keyboards[index]?this.keyboards[index]:''
    });
  }

  onChangeCaption(index: number) {
    this.createCaption.emit({
      enable: this.captionSlider,
      chapter: this.selectedChapter,
      text: this.captions[index]?this.captions[index]:''
    }); 
  }

  onChangeKeyboard(index: number) {
    this.createKeyboard.emit({
      enable: this.captionSlider,
      chapter: this.selectedChapter,
      text: this.keyboards[index]?this.keyboards[index]:''
    }); 
  }

  onDeleteChapter(index: number) {
    if(this.chapters.length > 1) {
      this.deleteChapter.emit(index);
    }
  }

}
