import { Component, OnDestroy, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { ContactsService } from './contacts.service';
import { fuseAnimations } from '../../../../../core/animations';
import { FormControl, FormGroup } from '@angular/forms';
import { FuseContactsContactFormDialogComponent } from './contact-form/contact-form.component';
import { MatDialog } from '@angular/material';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { Subscription } from 'rxjs/Subscription';
import {
    Router,
    ActivatedRoute,
    NavigationStart
} from '@angular/router';
import { ChannelService } from '../channel.service';

@Component({
    selector     : 'fuse-contacts',
    templateUrl  : './contacts.component.html',
    styleUrls    : ['./contacts.component.scss'],
    // encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class FuseContactsComponent implements OnInit, OnDestroy
{
    hasSelectedContacts: boolean;
    channelId: string;
    channelName: string;
    channelAbstact: string;
    breadcrumbs: Object[];
    searchInput: FormControl;
    dialogRef: any;
    onSelectedContactsChangedSubscription: Subscription;

    constructor(
        private contactsService: ContactsService,
        public dialog: MatDialog,
        private router: Router,
        private channelService: ChannelService,
        private activatedRoute: ActivatedRoute,
        private cdRef: ChangeDetectorRef
    )
    {
        this.searchInput = new FormControl('');
        this.channelAbstact = '';
        this.channelName = '';
    }

    newContact()
    {
        this.dialogRef = this.dialog.open(FuseContactsContactFormDialogComponent, {
            panelClass: 'contact-form-dialog',
            data      : {
                action: 'new'
            }
        });

        this.dialogRef.afterClosed()
            .subscribe((response: FormGroup) => {
                if ( !response )
                {
                    return;
                }

                this.contactsService.updateContact(response.getRawValue());

            });

    }

    ngOnInit()
    {
        this.getChannelData();

        this.router.events.forEach((event) => {
            if(event instanceof NavigationStart) {
                this.getChannelData();
            }
        });

        this.onSelectedContactsChangedSubscription =
            this.contactsService.onSelectedContactsChanged
                .subscribe(selectedContacts => {
                    this.hasSelectedContacts = selectedContacts.length > 0;
                });

        this.searchInput.valueChanges
            .debounceTime(300)
            .distinctUntilChanged()
            .subscribe(searchText => {
                this.contactsService.onSearchTextChanged.next(searchText);
            });
    }

    ngOnDestroy()
    {
        this.onSelectedContactsChangedSubscription.unsubscribe();
    }

    getChannelData() {
        let channelData = this.channelService.channelData;
        this.channelId = channelData['id'];
        this.breadcrumbs = [];

        if(channelData['data']) {
            this.channelName = channelData['data']['name'];
            this.channelAbstact = channelData['data']['abstact'];

            this.breadcrumbs.push({
                url: '/pg/channel/' + this.channelId + '/home',
                label: channelData['data']['name']
            });

            this.breadcrumbs.push({
                url: '/pg/channel/' + this.channelId + '/contacts',
                label: 'Contacts'
            });

            if (!this.cdRef['destroyed']) {
                this.cdRef.detectChanges();
            }
        }
    }
}
