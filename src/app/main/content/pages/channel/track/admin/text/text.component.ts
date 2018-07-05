import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss']
})
export class TextComponent implements OnInit {
  @Input() videoData: Object;
  @Output() videoDataChanged = new EventEmitter();

  form: FormGroup;
  formErrors: any;
  types: string[];
  statuses: string[];
  languages: Object[];
  formats: string[];

  constructor(
    private formBuilder: FormBuilder
  ) {
    // Reactive form errors
    this.formErrors = {
      title    : {},
      abstract : {},
      author   : {},
      type     : {},
      status   : {},
      language : {},
      format   : {},
      version  : {}
    };

    this.types = [
      'Introduction',
      'Explanation',
      'Essential',
      'Useful Tip'
    ];

    this.statuses = ['Private', 'Public', 'Archived'];

    this.languages = [
      {
        label: 'English (UK)',
        value: 'en-UK'
      },
      {
        label: 'English (US)',
        value: 'en-US'
      },
      {
        label: 'English (AU)',
        value: 'en-AU'
      },
      {
        label: 'Polish',
        value: 'pl'
      },
      {
        label: 'Dutch',
        value: 'da'
      }
    ];

    this.formats = ['personal', 'screencast'];
  }

  ngOnInit() {

    this.initForm();

  }

  initForm() {
    // Reactive Form
    this.form = this.formBuilder.group({
      title    : [
        this.videoData['data'] && this.videoData['data']['title']?this.videoData['data']['title']:'',
        Validators.required
      ],
      abstract : [
        this.videoData['data'] && this.videoData['data']['abstract']?this.videoData['data']['abstract']:'',
        Validators.required
      ],
      author   : [
        this.videoData['data'] && this.videoData['data']['author']?this.videoData['data']['author']:'',
        Validators.required
      ],
      type     : [
        this.videoData['data'] && this.videoData['data']['type']?this.videoData['data']['type']:'',
        Validators.required
      ],
      status   : [
        this.videoData['data'] && this.videoData['data']['status']?this.videoData['data']['status']:'',
        Validators.required
      ],
      language : [
        this.videoData['data'] && this.videoData['data']['language']?this.videoData['data']['language'][0]:'',
        Validators.required
      ],
      format   : [
        this.videoData['data'] && this.videoData['data']['format']?this.videoData['data']['format']:'',
        Validators.required
      ],
      version  : ['', Validators.required]
    });

    this.form.valueChanges.subscribe(() => {
      this.onFormValuesChanged();
    });
  }

  updateVideoData() {
    this.videoData['data']['title'] = this.form['value']['title'];
    this.videoData['data']['abstract'] = this.form['value']['abstract'];
    this.videoData['data']['author'] = this.form['value']['author'];
    this.videoData['data']['type'] = this.form['value']['type'];
    this.videoData['data']['status'] = this.form['value']['status'];
    this.videoData['data']['language'][0] = this.form['value']['language'];
    this.videoData['data']['format'] = this.form['value']['format'];

    this.videoDataChanged.emit(this.videoData);
  }

  onFormValuesChanged()
  {
    for ( const field in this.formErrors )
    {
      if ( !this.formErrors.hasOwnProperty(field) )
      {
        continue;
      }

      // Clear previous errors
      this.formErrors[field] = {};

      // Get the control
      const control = this.form.get(field);

      if ( control && control.dirty && !control.valid )
      {
        this.formErrors[field] = control.errors;
      }
    }

    this.updateVideoData();
  }

}
