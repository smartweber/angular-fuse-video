import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseConfigService } from '../../../../../core/services/config.service';
import { CognitoService } from '../../../../../core/services/cognito.service';
import { fuseAnimations } from '../../../../../core/animations';
import { AlertDialogComponent } from '../../../../../core/components/alert-dialog/alert-dialog.component';
import {
  Router
} from '@angular/router';
import {
    MatDialog
} from '@angular/material';


@Component({
    selector   : 'fuse-register',
    templateUrl: './register.component.html',
    styleUrls  : ['./register.component.scss'],
    animations : fuseAnimations
})
export class FuseRegisterComponent implements OnInit
{
    registerForm: FormGroup;
    registerFormErrors: any;

    verifyForm: FormGroup;
    verifyFormErrors: any;

    isVerify: boolean;
    registerEmail: string;

    constructor(
        private fuseConfig: FuseConfigService,
        private formBuilder: FormBuilder,
        private cognitoService: CognitoService,
        private router: Router,
        private dialog: MatDialog
    )
    {
        this.fuseConfig.setSettings({
            layout: {
                navigation: 'none',
                toolbar   : 'none',
                footer    : 'none'
            }
        });

        this.registerFormErrors = {
            email          : {},
            password       : {},
            passwordConfirm: {}
        };

        this.verifyFormErrors = {
            email: {},
            code: {}
        };

        this.isVerify = false;
        this.registerEmail = '';
    }

    ngOnInit()
    {
        this.registerForm = this.formBuilder.group({
            email          : ['', [Validators.required, Validators.email]],
            password       : ['', Validators.required],
            passwordConfirm: ['', [Validators.required, confirmPassword]]
        });

        this.registerForm.valueChanges.subscribe(() => {
            this.onRegisterFormValuesChanged();
        });

        this.verifyForm = this.formBuilder.group({
            email : ['', [Validators.required, Validators.email]],
            code : ['', Validators.required]
        });

        this.verifyForm.valueChanges.subscribe(() => {
            this.onVerifyFormValuesChanged();
        });
    }

    onVerifyFormValuesChanged()
    {
        for ( const field in this.verifyFormErrors )
        {
            if ( !this.verifyFormErrors.hasOwnProperty(field) )
            {
                continue;
            }

            // Clear previous errors
            this.verifyFormErrors[field] = {};

            // Get the control
            const control = this.verifyForm.get(field);

            if ( control && control.dirty && !control.valid )
            {
                this.verifyFormErrors[field] = control.errors;
            }
        }
    }

    onRegisterFormValuesChanged()
    {
        for ( const field in this.registerFormErrors )
        {
            if ( !this.registerFormErrors.hasOwnProperty(field) )
            {
                continue;
            }

            // Clear previous errors
            this.registerFormErrors[field] = {};

            // Get the control
            const control = this.registerForm.get(field);

            if ( control && control.dirty && !control.valid )
            {
                this.registerFormErrors[field] = control.errors;
            }
        }
    }

    submitForm(event:any) {
        event.preventDefault();
        this.registerEmail = this.registerForm['value']['email'];

        if(this.registerForm.valid) {
            this.cognitoService.signUp(this.registerForm['value']['email'], this.registerForm['value']['password'])
                .then((res) => {
                    this.isVerify = true;
                    this.verifyForm.controls['email'].setValue(this.registerEmail);
                })
                .catch((err) => {
                    console.log(err)
                    let config = {
                        width: '400px',
                        disableClose: false,
                        data: {
                            comment: err.message,
                            type: 'error'
                        }
                    };
                    this.dialog.open(AlertDialogComponent, config);
                });
        }
    }

    submitVerifyForm(event:any) {
        event.preventDefault();

        if(this.verifyForm.valid) {
            this.cognitoService.confirmRegistration(this.verifyForm['value']['email'], this.verifyForm['value']['code'])
                .then((res) => {
                })
                .catch((err) => {
                    console.log(err);
                    let config = {
                        width: '400px',
                        disableClose: false,
                        data: {
                            comment: err.message,
                            type: 'error'
                        }
                    };
                    this.dialog.open(AlertDialogComponent, config);
                });
        }
    }

    verifyCode() {
        this.isVerify = false;
    }
}

function confirmPassword(control: AbstractControl)
{
    if ( !control.parent || !control )
    {
        return;
    }

    const password = control.parent.get('password');
    const passwordConfirm = control.parent.get('passwordConfirm');

    if ( !password || !passwordConfirm )
    {
        return;
    }

    if ( passwordConfirm.value === '' )
    {
        return;
    }

    if ( password.value !== passwordConfirm.value )
    {
        return {
            passwordsNotMatch: true
        };
    }
}
