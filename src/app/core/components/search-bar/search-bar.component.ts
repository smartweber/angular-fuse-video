import { Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { FuseConfigService } from '../../services/config.service';
import { Subscription } from 'rxjs/Subscription';
import { FormControl } from '@angular/forms';
import {
    Router,
    ActivatedRoute
} from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { ChannelEventService } from '../../services/channel-event.service';

@Component({
    selector   : 'fuse-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls  : ['./search-bar.component.scss']
})
export class FuseSearchBarComponent implements OnInit, OnDestroy
{
    toolbarColor: string;
    channelData: Object;
    onSettingsChanged: Subscription;
    onChannelEventChanged: Subscription;

    options: string[];
    searchCtrl: FormControl;
    filteredOptions: Observable<any[]>;
    @Output() onInput: EventEmitter<any> = new EventEmitter();

    constructor(
        private fuseConfig: FuseConfigService,
        private router: Router,
        private route: ActivatedRoute,
        private channelEventService: ChannelEventService
    )
    {

        this.onSettingsChanged =
            this.fuseConfig.onSettingsChanged
                .subscribe(
                    (newSettings) => {
                        this.toolbarColor = newSettings.colorClasses.toolbar;
                    }
                );

        this.options = [
            'One',
            'Two',
            'Three'
        ];
    }

    ngOnInit()
    {
        this.searchCtrl = new FormControl();
        this.filteredOptions = this.searchCtrl.valueChanges
            .pipe(
                startWith(''),
                map(state => state ? this.filterStates(state) : this.options.slice())
            );

        this.onChannelEventChanged = 
            this.channelEventService.channelDataChaned.subscribe(channelData => {
                this.channelData = channelData;
            });
    }

    ngOnDestroy() {
        if(this.onChannelEventChanged) {
            this.onChannelEventChanged.unsubscribe();
        }
    }

    filterStates(name: string) {
        return this.options.filter(state =>
            state.toLowerCase().indexOf(name.toLowerCase()) === 0);
    }

    search(event)
    {
        event.preventDefault();
        let search = this.searchCtrl.value;
        this.searchCtrl.setValue('');
        let channelId = this.channelData['id']?this.channelData['id']:'';

        if(this.router.url && (this.router.url.indexOf('/pg/channel') === 0) && channelId) {
            this.router.navigate(['/pg/channel/' + channelId + '/videos'], {
                queryParams: { 
                    search: search
                }
            });
        } else {
            // this.router.navigate(['/fs/videos'], { queryParams: { search: search } });
        }

        // this.onInput.emit(value);
    }

}
