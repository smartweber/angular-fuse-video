import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VgCoreModule } from 'videogular2/core';
import { VgControlsModule } from 'videogular2/controls';
import { VgOverlayPlayModule } from 'videogular2/overlay-play';
import { VgBufferingModule } from 'videogular2/buffering';
import { SharedModule } from '../../../../core/modules/shared.module';
import { AuthguardService } from '../../../../core/services/authguard.service';

import { HomeComponent } from './home.component';

const routes = [
  {
    path : '**',
    component: HomeComponent,
    canActivate: [AuthguardService]
  }
];

@NgModule({
  imports: [
    CommonModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
  declarations: [HomeComponent],
  providers: [
    AuthguardService
  ]
})
export class HomeModule { }
