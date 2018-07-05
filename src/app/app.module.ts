import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import {
    MatDialogModule
} from '@angular/material';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import 'hammerjs';
import { SharedModule } from './core/modules/shared.module';
import { AppComponent } from './app.component';
import { FuseFakeDbService } from './fuse-fake-db/fuse-fake-db.service';
import { FuseMainModule } from './main/main.module';
import { FuseSplashScreenService } from './core/services/splash-screen.service';
import { FuseConfigService } from './core/services/config.service';
import { FuseNavigationService } from './core/components/navigation/navigation.service';
import { HttpService } from './core/services/http.service';
import { CognitoService } from './core/services/cognito.service';
import { AuthguardService } from './core/services/authguard.service';
import { FuseSampleModule } from './main/content/sample/sample.module';
import { TranslateModule } from '@ngx-translate/core';

const appRoutes: Routes = [
    { 
        path: '',
        redirectTo: 'pg/home',
        pathMatch: 'full'
    },
    {
        path        : 'pg',
        loadChildren: './main/content/pages/pages.module#FusePagesModule'
    },
    {
        path        : 'fs',
        loadChildren: './main/content/apps/apps.module#FuseAppsModule'
    },
    { path: '**', redirectTo: 'pg/home' }
];

@NgModule({
    declarations: [
        AppComponent
    ],
    imports     : [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes),
        SharedModule,
        TranslateModule.forRoot(),
        InMemoryWebApiModule.forRoot(FuseFakeDbService, {
            delay             : 0,
            passThruUnknownUrl: true
        }),
        FuseMainModule,
        FuseSampleModule,
        HttpModule,
        MatDialogModule
    ],
    providers   : [
        FuseSplashScreenService,
        FuseConfigService,
        FuseNavigationService,
        HttpService,
        CognitoService,
        AuthguardService
    ],
    bootstrap   : [
        AppComponent
    ]
})
export class AppModule
{
}
