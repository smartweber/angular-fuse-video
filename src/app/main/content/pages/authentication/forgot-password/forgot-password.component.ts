import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    selector   : 'fuse-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls  : ['./forgot-password.component.scss'],
    animations : fuseAnimations
})
export class FuseForgotPasswordComponent implements OnInit
{
    forgotPasswordForm: FormGroup;
    forgotPasswordFormErrors: any;

    resetPasswordForm: FormGroup;
    resetPasswordFormErrors: any;

    isReset: boolean;

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

        this.forgotPasswordFormErrors = {
            email: {}
        };

        this.resetPasswordFormErrors = {
            email: {},
            code: {},
            password: {}
        };

        this.isReset = false;
    }

    ngOnInit()
    {
        this.forgotPasswordForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });

        this.forgotPasswordForm.valueChanges.subscribe(() => {
            this.onForgotPasswordFormValuesChanged();
        });

        this.resetPasswordForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            code: ['', [Validators.required]],
            password: ['', [Validators.required]]
        });

        this.resetPasswordForm.valueChanges.subscribe(() => {
            this.onResetPasswordFormValuesChanged();
        });
    }

    onResetPasswordFormValuesChanged()
    {
        for ( const field in this.resetPasswordFormErrors )
        {
            if ( !this.resetPasswordFormErrors.hasOwnProperty(field) )
            {
                continue;
            }

            // Clear previous errors
            this.resetPasswordFormErrors[field] = {};

            // Get the control
            const control = this.resetPasswordForm.get(field);

            if ( control && control.dirty && !control.valid )
            {
                this.resetPasswordFormErrors[field] = control.errors;
            }
        }
    }

    onForgotPasswordFormValuesChanged()
    {
        for ( const field in this.forgotPasswordFormErrors )
        {
            if ( !this.forgotPasswordFormErrors.hasOwnProperty(field) )
            {
                continue;
            }

            // Clear previous errors
            this.forgotPasswordFormErrors[field] = {};

            // Get the control
            const control = this.forgotPasswordForm.get(field);

            if ( control && control.dirty && !control.valid )
            {
                this.forgotPasswordFormErrors[field] = control.errors;
            }
        }
    }

    submitForm(event: any) {
        event.preventDefault();
        let email = this.forgotPasswordForm['value']['email'];

        if(this.forgotPasswordForm.valid) {
            this.cognitoService.forgotPassword(this.forgotPasswordForm['value']['email'])
                .then((res) => {
                    this.isReset = true;
                    this.resetPasswordForm.controls['email'].setValue(email);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }

    submitResetForm(event: any) {
        event.preventDefault();

        if(this.resetPasswordForm.valid) {
            this.cognitoService.resetPassword(
                this.resetPasswordForm['value']['email'],
                this.resetPasswordForm['value']['code'],
                this.resetPasswordForm['value']['password']
            )
                .then((res) => {
                    let config = {
                        width: '400px',
                        disableClose: false,
                        data: {
                            comment: 'Recovering your password is successful!',
                            type: 'success'
                        }
                    };
                    const dialogRef = this.dialog.open(AlertDialogComponent, config);

                    dialogRef.afterClosed().subscribe(result => {
                        this.router.navigate(['/login']);    
                    });
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
}
