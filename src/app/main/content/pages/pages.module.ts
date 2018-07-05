import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VgCoreModule } from 'videogular2/core';
import { VgControlsModule } from 'videogular2/controls';
import { VgOverlayPlayModule } from 'videogular2/overlay-play';
import { VgBufferingModule } from 'videogular2/buffering';

import { LoginModule } from './authentication/login/login.module';
import { RegisterModule } from './authentication/register/register.module';
import { ForgotPasswordModule } from './authentication/forgot-password/forgot-password.module';
import { ResetPasswordModule } from './authentication/reset-password/reset-password.module';
import { LockModule } from './authentication/lock/lock.module';
import { MailConfirmModule } from './authentication/mail-confirm/mail-confirm.module';
import { HomeModule } from './home/home.module';
import { ChannelModule } from './channel/channel.module';

const routes = [
    {
        path : 'home',
        loadChildren: './home/home.module#HomeModule'
    },
    {
        path : 'channel',
        loadChildren: './channel/channel.module#ChannelModule'
    }
];

@NgModule({
    imports: [
        // Auth
        LoginModule,
        RegisterModule,
        ForgotPasswordModule,
        ResetPasswordModule,
        LockModule,
        MailConfirmModule,
        RouterModule.forChild(routes)
    ],
    declarations: []
})
export class FusePagesModule
{

}
