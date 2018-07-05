import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MaterialModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ColorPickerModule } from 'ngx-color-picker';
import { NgxDnDModule } from '@swimlane/ngx-dnd';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ContextMenuModule } from 'ngx-contextmenu';
import { RouterModule } from '@angular/router';

import { FuseMatSidenavHelperDirective, FuseMatSidenavTogglerDirective } from '../directives/fuse-mat-sidenav-helper/fuse-mat-sidenav-helper.directive';
import { FuseMatSidenavHelperService } from '../directives/fuse-mat-sidenav-helper/fuse-mat-sidenav-helper.service';
import { FusePipesModule } from '../pipes/pipes.module';
import { FuseConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent } from '../components/alert-dialog/alert-dialog.component';
import { FuseCountdownComponent } from '../components/countdown/countdown.component';
import { FuseMatchMedia } from '../services/match-media.service';
import { FuseNavbarVerticalService } from '../../main/navbar/vertical/navbar-vertical.service';
import { FuseHighlightComponent } from '../components/highlight/highlight.component';
import { FusePerfectScrollbarDirective } from '../directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { FuseIfOnDomDirective } from '../directives/fuse-if-on-dom/fuse-if-on-dom.directive';
import { FuseMaterialColorPickerComponent } from '../components/material-color-picker/material-color-picker.component';
import { FuseTranslationLoaderService } from '../services/translation-loader.service';
import { CookieService } from 'ngx-cookie-service';
import { TranslateModule } from '@ngx-translate/core';
import { ChartsModule } from 'ng2-charts';
import { BreadScrumbComponent } from '../components/bread-scrumb/bread-scrumb.component';
import { VideoCardComponent } from '../components/video/video-card/video-card.component';
import { AddVideoDialogComponent } from '../components/add-video-dialog/add-video-dialog.component';
import { EditableContentComponent } from '../components/editable-content/editable-content.component';

import { VgCoreModule } from 'videogular2/core';
import { VgControlsModule } from 'videogular2/controls';
import { VgOverlayPlayModule } from 'videogular2/overlay-play';
import { VgBufferingModule } from 'videogular2/buffering';

import { MentionModule } from '../components/mention/mention.module';
import { FeedPostAreaComponent } from '../components/feed-post-area/feed-post-area.component';
import { ChannelToolbarComponent } from '../components/channel-toolbar/channel-toolbar.component';
import { CustomVideoPlayerCardComponent } from '../components/video/video-player-card/video-player-card.component';
import { VideoThumbnailCardComponent } from '../components/video/video-thumbnail-card/video-thumbnail-card.component';

@NgModule({
    declarations   : [
        FuseMatSidenavHelperDirective,
        FuseMatSidenavTogglerDirective,
        FuseConfirmDialogComponent,
        FuseCountdownComponent,
        FuseHighlightComponent,
        FuseIfOnDomDirective,
        FusePerfectScrollbarDirective,
        FuseMaterialColorPickerComponent,
        AlertDialogComponent,
        BreadScrumbComponent,
        VideoCardComponent,
        AddVideoDialogComponent,
        FeedPostAreaComponent,
        ChannelToolbarComponent,
        CustomVideoPlayerCardComponent,
        VideoThumbnailCardComponent,
        EditableContentComponent
    ],
    imports        : [
        FlexLayoutModule,
        MaterialModule,
        CommonModule,
        FormsModule,
        FusePipesModule,
        ReactiveFormsModule,
        ColorPickerModule,
        NgxDnDModule,
        NgxDatatableModule,
        ChartsModule,
        RouterModule,
        VgCoreModule,
        VgControlsModule,
        VgOverlayPlayModule,
        VgBufferingModule,
        MentionModule,
        ContextMenuModule.forRoot()
    ],
    exports        : [
        FlexLayoutModule,
        MaterialModule,
        CommonModule,
        FormsModule,
        FuseMatSidenavHelperDirective,
        FuseMatSidenavTogglerDirective,
        FusePipesModule,
        FuseCountdownComponent,
        FuseHighlightComponent,
        FusePerfectScrollbarDirective,
        ReactiveFormsModule,
        ColorPickerModule,
        NgxDnDModule,
        NgxDatatableModule,
        FuseIfOnDomDirective,
        FuseMaterialColorPickerComponent,
        TranslateModule,
        ChartsModule,
        BreadScrumbComponent,
        VideoCardComponent,
        VgCoreModule,
        VgControlsModule,
        VgOverlayPlayModule,
        VgBufferingModule,
        MentionModule,
        ContextMenuModule,
        FeedPostAreaComponent,
        ChannelToolbarComponent,
        CustomVideoPlayerCardComponent,
        VideoThumbnailCardComponent,
        EditableContentComponent
    ],
    entryComponents: [
        FuseConfirmDialogComponent,
        AlertDialogComponent,
        AddVideoDialogComponent
    ],
    providers      : [
        CookieService,
        FuseMatchMedia,
        FuseNavbarVerticalService,
        FuseMatSidenavHelperService,
        FuseTranslationLoaderService
    ]
})

export class SharedModule
{

}
