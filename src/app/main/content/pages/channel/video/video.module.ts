import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../../core/modules/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { VideoMainSideNavComponent } from './sidenavs/main/main.component';
import { VideoComponent } from './video.component';
import { VideoListComponent } from './video-list/video-list.component';
import { VideoService } from './video.service';

const routes: Routes = [
  {
    path : '**',
    component: VideoComponent,
    resolve  : {
      contacts: VideoService
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes) 
  ],
  declarations: [
    VideoMainSideNavComponent,
    VideoComponent,
    VideoListComponent
  ],
  providers: [
    VideoService
  ]
})
export class VideoModule { }
