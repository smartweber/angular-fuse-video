import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../../../core/modules/shared.module';
import { FuseDemoModule } from '../../../../../core/components/demo/demo.module';
import { AuthguardService } from '../../../../../core/services/authguard.service';

import { ChannelTrackComponent } from './track.component';
import { TrackDetailComponent } from './track-detail/track-detail.component';

import { TrackService } from './track.service';
import { ProfileService } from './profile.service';
import { TrackAdminService } from './admin/admin.service';
import { TimelineComponent } from './timeline/timeline.component';
import { MainTrackSidenavComponent } from './sidenavs/main/main-sidenav.component';
import { ChannelAdminComponent } from './admin/admin.component';
import { EffectChapterAreaComponent } from './admin/effect-chapter-area/effect-chapter-area.component';
import { ChannelConfigurationComponent } from './admin/configuration/configuration.component';
import { EffectActionAreaComponent } from './admin/effect-action-area/effect-action-area.component';
import { DraggableBlockComponent } from './admin/draggable-block/draggable-block.component';
import { QuickGuideComponent } from './admin/quick-guide/quick-guide.component';
import { ManuscriptComponent } from './admin/manuscript/manuscript.component';
import { TextComponent } from './admin/text/text.component';

const routes: Routes = [
  {
    path     : '',
    component: ChannelTrackComponent,
    canActivate: [AuthguardService],
    children: [
      {
        path: ':track_id',
        component: TrackDetailComponent,
        resolve  : {
          profile: ProfileService
        }
      },
      {
        path: ':track_id/:step_id',
        component: TrackDetailComponent,
        resolve  : {
          profile: ProfileService
        }
      },
      {
        path : ':track_id/:step_id/edit',
        component: ChannelAdminComponent,
        resolve  : {
          trackAdmin: TrackAdminService
        }
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
    ChannelTrackComponent,
    TrackDetailComponent,
    TimelineComponent,
    MainTrackSidenavComponent,
    ChannelAdminComponent,
    EffectChapterAreaComponent,
    ChannelConfigurationComponent,
    EffectActionAreaComponent,
    DraggableBlockComponent,
    QuickGuideComponent,
    ManuscriptComponent,
    TextComponent
  ],
  providers: [
    TrackService,
    ProfileService,
    TrackAdminService,
    AuthguardService
  ]
})
export class TrackModule { }
