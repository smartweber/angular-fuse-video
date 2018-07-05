import {
    Component,
    OnInit,
    OnDestroy
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Router,
  ActivatedRoute
} from '@angular/router';
import {
    MatDialog
} from '@angular/material';
import { FuseConfigService } from '../../../../../core/services/config.service';
import { CognitoService } from '../../../../../core/services/cognito.service';
import { fuseAnimations } from '../../../../../core/animations';
import { AlertDialogComponent } from '../../../../../core/components/alert-dialog/alert-dialog.component';

@Component({
    selector   : 'fuse-login',
    templateUrl: './login.component.html',
    styleUrls  : ['./login.component.scss'],
    animations : fuseAnimations
})
export class FuseLoginComponent implements OnInit, OnDestroy
{
    redirectPath: string;
    loginForm: FormGroup;
    loginFormErrors: any;
    routeQueryParamsSub: any;

    isLoadPage: boolean;

    constructor(
        private fuseConfig: FuseConfigService,
        private formBuilder: FormBuilder,
        private cognitoService: CognitoService,
        private router: Router,
        private route: ActivatedRoute,
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

        this.loginFormErrors = {
            email   : {},
            password: {}
        };

        this.isLoadPage = false;
        this.redirectPath = '';
    }

    ngOnInit()
    {
        this.cognitoService.checkLogin()
            .then((res) => {
                if(res) {
                    this.router.navigate([this.redirectPath]);
                } else {
                    this.initForm();
                }
            })
            .catch((err) => {
                console.log(err);
                this.initForm();
            });

        this.routeQueryParamsSub = this.route.queryParams.subscribe(queryParams => {
            if(queryParams) {
                this.redirectPath = queryParams['ref']?queryParams['ref']:'';
            }
        });
    }

    ngOnDestroy() {
        if(this.routeQueryParamsSub) {
            this.routeQueryParamsSub.unsubscribe();
        }
    }

    initForm() {
        this.loginForm = this.formBuilder.group({
            email   : ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });

        this.loginForm.valueChanges.subscribe(() => {
            this.onLoginFormValuesChanged();
        });

        this.isLoadPage = true;
    }

    onLoginFormValuesChanged()
    {
        for ( const field in this.loginFormErrors )
        {
            if ( !this.loginFormErrors.hasOwnProperty(field) )
            {
                continue;
            }

            // Clear previous errors
            this.loginFormErrors[field] = {};

            // Get the control
            const control = this.loginForm.get(field);

            if ( control && control.dirty && !control.valid )
            {
                this.loginFormErrors[field] = control.errors;
            }
        }
    }

    submitForm() {
        if(this.loginForm.valid) {
            this.cognitoService.signIn(this.loginForm['value']['email'], this.loginForm['value']['password'])
                .then((res) => {
                    this.router.navigate([this.redirectPath]);
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
}
