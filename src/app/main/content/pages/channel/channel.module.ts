import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../../core/modules/shared.module';

import { ChannelComponent } from './channel.component';
import { ChannelService } from './channel.service';

const routes = [
  {
    path : ':id',
    component: ChannelComponent,
    resolve  : {
      contacts: ChannelService
    },
    children: [
      {
        path        : 'home',
        loadChildren: './home/channel-home.module#ChannelHomeModule'
      },
      {
        path        : 'tracks',
        loadChildren: './track/track.module#TrackModule'
      },
      {
        path        : 'contacts',
        loadChildren: './contacts/contacts.module#FuseContactsModule'
      },
      {
        path        : 'mail',
        loadChildren: './mail/mail.module#FuseMailModule'
      },
      {
        path        : 'todo',
        loadChildren: './todo/todo.module#FuseTodoModule'
      },
      {
        path        : 'videos',
        loadChildren: './video/video.module#VideoModule'
      },
      {
        path      : '**',
        redirectTo: 'home'
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [
    ChannelComponent
  ],
  providers: [
    ChannelService
  ]
})
export class ChannelModule { }
