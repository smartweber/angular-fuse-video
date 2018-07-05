import { NgModule } from '@angular/core';
import { SharedModule } from '../../modules/shared.module';
import { RouterModule } from '@angular/router';
import { FuseDemoContentComponent } from './demo-content/demo-content.component';

@NgModule({
    declarations: [
        FuseDemoContentComponent
    ],
    imports     : [
        SharedModule,
        RouterModule
    ],
    exports     : [
        FuseDemoContentComponent
    ]
})
export class FuseDemoModule
{
}
