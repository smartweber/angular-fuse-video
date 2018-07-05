import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'app-editable-content',
  templateUrl: './editable-content.component.html',
  styleUrls: ['./editable-content.component.scss']
})
export class EditableContentComponent implements OnInit {
  types: string[];
  isEdit: boolean;
  isShowEditBtn: boolean;

  @Input() type: string;
  @Input() inputValue: string;
  @Output() changeInputValue = new EventEmitter();

  constructor() {
    this.isEdit = false;
    this.isShowEditBtn = false;
    this.types = ['textarea', 'input'];
  }

  ngOnInit() {
  }

  onChange($event: any) {
    this.changeInputValue.emit($event.target.value);
  }

}
