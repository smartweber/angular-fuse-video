import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChannelHomeService } from '../channel-home.service';
import { ChannelService } from '../../channel.service';
import {
  Router
} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../../../../environments/environment';
import { HttpService } from '../../../../../../core/services/http.service';
import { CognitoService } from '../../../../../../core/services/cognito.service';
import { AlertDialogComponent } from '../../../../../../core/components/alert-dialog/alert-dialog.component';
import {
  MatDialog
} from '@angular/material';

@Component({
  selector: 'app-home-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminHomeComponent implements OnInit, OnDestroy {
  editDoneSub: any;
  channelData: any;

  statuses: string[];

  form: FormGroup;
  formErrors: any;

  constructor(
    private channelHomeService: ChannelHomeService,
    private channelService: ChannelService,
    private router: Router,
    private formBuilder: FormBuilder,
    private httpService: HttpService,
    private cognitoService: CognitoService,
    private dialog: MatDialog
   ) {
    this.formErrors = {
      name    : {},
      abstact : {},
      status  : {},
      version : {}
    };

    this.statuses = ['Private', 'Public', 'Archived'];
    this.channelData = this.channelService['channelData'];
  }

  ngOnInit() {
    this.initForm();

    this.editDoneSub = this.channelHomeService.editDoneEmitted$.subscribe(() => {
      let channelId = this.channelData?this.channelData['id']:'';

      if (channelId) {
        let putData = {
          name: this.form['value']['name'],
          abstact: this.form['value']['abstact'],
          status: this.form['value']['status']
        };

        this.httpService.put(environment['api'] + 'channels/' + channelId, putData, true)
          .subscribe((res: any) => {
            this.channelService.getChannel(channelId).then((channelData) => {
              this.router.navigate(['/pg/channel/' + channelId + '/home/detail']);
            });
          }, (error: any) => {
            this.alertError(error);
          });
      }
    });

    this.channelHomeService.emitPageChange(true);
  }

  ngOnDestroy() {
    if(this.editDoneSub) {
      this.editDoneSub.unsubscribe();
    }
  }

  alertError(error: Object) {
    if(error['type'] === 0) {
      let config = {
        width: '400px',
        disableClose: false,
        data: {
          type: 'info',
          comment: error['message']
        }
      };
      this.dialog.open(AlertDialogComponent, config);
    } else if(error['type'] === 1) {
      this.cognitoService.signOut(this.router.url);
    }
  }

  initForm() {
    // Reactive Form
    this.form = this.formBuilder.group({
      name    : [
        this.channelData['data'] && this.channelData['data']['name']?this.channelData['data']['name']:'',
        Validators.required
      ],
      abstact : [
        this.channelData['data'] && this.channelData['data']['abstact']?this.channelData['data']['abstact']:'',
        Validators.required
      ],
      status   : [
        this.channelData['data'] && this.channelData['data']['status']?this.channelData['data']['status']:'',
        Validators.required
      ],
      version  : ['', Validators.required]
    });

    this.form.valueChanges.subscribe(() => {
      this.onFormValuesChanged();
    });
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
  }

}
