import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../../../core/modules/shared.module';
import { FuseDemoModule } from '../../../../../core/components/demo/demo.module';

import { ChannelHomeComponent } from './channel-home.component';
import { ChannelHomeDetailComponent } from './home-detail/channel-home-detail.component';
import { MainChannelHomeSidenavComponent } from './sidenavs/main/main-sidenav.component';
import { AdminHomeComponent } from './admin/admin.component';
import { ChannelHomeService } from './channel-home.service';


const routes: Routes = [
  {
    path : '',
    component: ChannelHomeComponent,
    children: [
      {
        path : 'detail',
        component: ChannelHomeDetailComponent
      },
      {
        path : 'edit',
        component: AdminHomeComponent
      },
      {
        path      : '**',
        redirectTo: 'detail'
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FuseDemoModule
  ],
  declarations: [
    ChannelHomeComponent,
    ChannelHomeDetailComponent,
    MainChannelHomeSidenavComponent,
    AdminHomeComponent
  ],
  providers: [
    ChannelHomeService
  ]
})
export class ChannelHomeModule { }
