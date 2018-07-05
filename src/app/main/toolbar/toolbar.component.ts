import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { FuseConfigService } from '../../core/services/config.service';
import { CognitoService } from '../../core/services/cognito.service';
import { HttpService } from '../../core/services/http.service';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '../../core/services/translation-loader.service';
import { AddVideoDialogComponent } from '../../core/components/add-video-dialog/add-video-dialog.component';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { MatDialog } from '@angular/material';
import { AlertDialogComponent } from '../../core/components/alert-dialog/alert-dialog.component';

import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';

import { environment } from '../../../environments/environment';

@Component({
    selector   : 'fuse-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls  : ['./toolbar.component.scss']
})

export class FuseToolbarComponent implements OnInit, OnDestroy {
    userStatusOptions: any[];
    channels: Object[];
    languages: any;
    selectedLanguage: any;
    httpServiceSub: any;
    showLoadingBar: boolean;
    horizontalNav: boolean;

    constructor(
        private router: Router,
        private fuseConfig: FuseConfigService,
        private cognitoService: CognitoService,
        private translate: TranslateService,
        private translationLoader: FuseTranslationLoaderService,
        private dialog: MatDialog,
        iconRegistry: MatIconRegistry,
        sanitizer: DomSanitizer,
        private httpService: HttpService
    )
    {
        this.translationLoader.loadTranslations(english, turkish);
        // iconRegistry.addSvgIcon(
        //     'help-icon',
        //     sanitizer.bypassSecurityTrustResourceUrl('assets/images/etc/help.svg')
        // );

        this.userStatusOptions = [
            {
                'title': 'Online',
                'icon' : 'icon-checkbox-marked-circle',
                'color': '#4CAF50'
            },
            {
                'title': 'Away',
                'icon' : 'icon-clock',
                'color': '#FFC107'
            },
            {
                'title': 'Do not Disturb',
                'icon' : 'icon-minus-circle',
                'color': '#F44336'
            },
            {
                'title': 'Invisible',
                'icon' : 'icon-checkbox-blank-circle-outline',
                'color': '#BDBDBD'
            },
            {
                'title': 'Offline',
                'icon' : 'icon-checkbox-blank-circle-outline',
                'color': '#616161'
            }
        ];

        this.languages = [
            {
                'id'   : 'en',
                'title': 'English',
                'flag' : 'us'
            },
            {
                'id'   : 'tr',
                'title': 'Turkish',
                'flag' : 'tr'
            }
        ];

        this.selectedLanguage = this.languages[0];

        router.events.subscribe(
            (event) => {
                if ( event instanceof NavigationStart )
                {
                    this.showLoadingBar = true;
                }
                if ( event instanceof NavigationEnd )
                {
                    this.showLoadingBar = false;
                }
            });

        this.fuseConfig.onSettingsChanged.subscribe((settings) => {
            this.horizontalNav = settings.layout.navigation === 'top';
        });
        this.channels = [];

    }

    ngOnInit() {
        this.httpServiceSub = this.httpService.get(environment['api'] + 'query/channel?tubeId=Sk0DkWraM', true)
            .subscribe((res: any) => {
                if(res && res.hasOwnProperty('Items')) {
                    this.channels = res['Items'];
                }
            }, (error: any) => {
                console.log(error)
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
            });
    }

    ngOnDestroy() {
        if(this.httpServiceSub) {
            this.httpServiceSub.unsubscribe();
        }
    }

    search(value)
    {
        // Do your search here...
        console.log(value);
    }

    setLanguage(lang)
    {
        // Set the selected language for toolbar
        this.selectedLanguage = lang;

        // Use the selected language for translations
        this.translate.use(lang.id);
    }

    addNewVideo(event: any) {
        event.preventDefault();

        let dialogRef = this.dialog.open(AddVideoDialogComponent, {
            disableClose: false,
            data: 'data'
        });

        dialogRef.afterClosed()
            .subscribe(response => {
                if ( !response )
                {
                    return;
                }
                
            });
    }

    logOut() {
        this.cognitoService.signOut();
    }
}
