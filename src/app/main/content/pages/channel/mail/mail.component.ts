import {
    Component,
    OnDestroy,
    OnInit,
    ChangeDetectorRef
} from '@angular/core';
import { MailService } from './mail.service';
import { Subscription } from 'rxjs/Subscription';
import { FormControl } from '@angular/forms';
import { Mail } from './mail.model';
import { FuseTranslationLoaderService } from '../../../../../core/services/translation-loader.service';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';
import {
    Router,
    ActivatedRoute,
    NavigationStart
} from '@angular/router';
import { ChannelService } from '../channel.service';


@Component({
    selector   : 'fuse-mail',
    templateUrl: './mail.component.html',
    styleUrls  : ['./mail.component.scss']
})
export class FuseMailComponent implements OnInit, OnDestroy
{
    hasSelectedMails: boolean;
    isIndeterminate: boolean;
    folders: any[];
    filters: any[];
    labels: any[];
    breadcrumbs: Object[];
    channelId: string;
    channelAbstact: string;
    channelName: string;

    searchInput: FormControl;
    currentMail: Mail;

    onSelectedMailsChanged: Subscription;
    onFoldersChanged: Subscription;
    onFiltersChanged: Subscription;
    onLabelsChanged: Subscription;
    onCurrentMailChanged: Subscription;

    constructor(
        private mailService: MailService,
        private translationLoader: FuseTranslationLoaderService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private channelService: ChannelService,
        private cdRef: ChangeDetectorRef
    )
    {
        this.channelAbstact = '';
        this.channelName = '';
        this.searchInput = new FormControl('');
        this.translationLoader.loadTranslations(english, turkish);
    }

    ngOnInit()
    {
        this.getChannelData();

        this.router.events.forEach((event) => {
            if(event instanceof NavigationStart) {
                this.getChannelData();
            }
        });
        this.onSelectedMailsChanged =
            this.mailService.onSelectedMailsChanged
                .subscribe(selectedMails => {

                    setTimeout(() => {
                        this.hasSelectedMails = selectedMails.length > 0;
                        this.isIndeterminate = (selectedMails.length !== this.mailService.mails.length && selectedMails.length > 0);
                    }, 0);
                });

        this.onFoldersChanged =
            this.mailService.onFoldersChanged
                .subscribe(folders => {
                    this.folders = this.mailService.folders;
                });

        this.onFiltersChanged =
            this.mailService.onFiltersChanged
                .subscribe(folders => {
                    this.filters = this.mailService.filters;
                });

        this.onLabelsChanged =
            this.mailService.onLabelsChanged
                .subscribe(labels => {
                    this.labels = this.mailService.labels;
                });

        this.onCurrentMailChanged =
            this.mailService.onCurrentMailChanged
                .subscribe(currentMail => {
                    if ( !currentMail )
                    {
                        this.currentMail = null;
                    }
                    else
                    {
                        this.currentMail = currentMail;
                    }
                });

        this.searchInput.valueChanges
            .debounceTime(300)
            .distinctUntilChanged()
            .subscribe(searchText => {
                this.mailService.onSearchTextChanged.next(searchText);
            });
    }

    ngOnDestroy()
    {
        this.onSelectedMailsChanged.unsubscribe();
        this.onFoldersChanged.unsubscribe();
        this.onFiltersChanged.unsubscribe();
        this.onLabelsChanged.unsubscribe();
        this.onCurrentMailChanged.unsubscribe();

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
                url: '/pg/channel/' + this.channelId + '/mail/inbox',
                label: 'Tickets'
            });

            if (!this.cdRef['destroyed']) {
                this.cdRef.detectChanges();
            }
        }
    }

    toggleSelectAll()
    {
        this.mailService.toggleSelectAll();
    }

    selectMails(filterParameter?, filterValue?)
    {
        this.mailService.selectMails(filterParameter, filterValue);
    }

    deselectMails()
    {
        this.mailService.deselectMails();
    }

    deSelectCurrentMail()
    {
        this.mailService.onCurrentMailChanged.next(null);
    }

    toggleLabelOnSelectedMails(labelId)
    {
        this.mailService.toggleLabelOnSelectedMails(labelId);
    }

    setFolderOnSelectedMails(folderId)
    {
        this.mailService.setFolderOnSelectedMails(folderId);
    }
}
