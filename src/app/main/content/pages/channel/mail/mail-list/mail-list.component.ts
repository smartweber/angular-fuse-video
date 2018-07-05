import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { Mail } from '../mail.model';
import { ActivatedRoute } from '@angular/router';
import { MailService } from '../mail.service';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import { fuseAnimations } from '../../../../../../core/animations';

@Component({
    selector   : 'fuse-mail-list',
    templateUrl: './mail-list.component.html',
    styleUrls  : ['./mail-list.component.scss'],
    animations : fuseAnimations
})
export class FuseMailListComponent implements OnInit, OnDestroy
{
    @Input() channelId: string;
    mails: Mail[];
    currentMail: Mail;

    onMailsChanged: Subscription;
    onCurrentMailChanged: Subscription;

    constructor(
        private route: ActivatedRoute,
        private mailService: MailService,
        private location: Location
    )
    {
    }

    ngOnInit()
    {
        // Subscribe to update mails on changes
        this.onMailsChanged =
            this.mailService.onMailsChanged
                .subscribe(mails => {
                    this.mails = mails;
                });

        // Subscribe to update current mail on changes
        this.onCurrentMailChanged =
            this.mailService.onCurrentMailChanged
                .subscribe(currentMail => {
                    if ( !currentMail )
                    {
                        // Set the current mail id to null to deselect the current mail
                        this.currentMail = null;

                        // Handle the location changes
                        const labelHandle  = this.route.snapshot.params.labelHandle,
                              filterHandle = this.route.snapshot.params.filterHandle,
                              folderHandle = this.route.snapshot.params.folderHandle;

                        if ( labelHandle )
                        {
                            this.location.go('pg/channel/' + this.channelId + '/mail/label/' + labelHandle);
                        }
                        else if ( filterHandle )
                        {
                            this.location.go('pg/channel/' + this.channelId + '/mail/filter/' + filterHandle);
                        }
                        else
                        {
                            this.location.go('pg/channel/' + this.channelId + '/mail/' + folderHandle);
                        }
                    }
                    else
                    {
                        this.currentMail = currentMail;
                    }
                });
    }

    ngOnDestroy()
    {
        this.onMailsChanged.unsubscribe();
        this.onCurrentMailChanged.unsubscribe();
    }

    /**
     * Read mail
     * @param mailId
     */
    readMail(mailId)
    {
        const labelHandle  = this.route.snapshot.params.labelHandle,
              filterHandle = this.route.snapshot.params.filterHandle,
              folderHandle = this.route.snapshot.params.folderHandle;

        if ( labelHandle )
        {
            this.location.go('pg/channel/' + this.channelId + '/mail/label/' + labelHandle + '/' + mailId);
        }
        else if ( filterHandle )
        {
            this.location.go('pg/channel/' + this.channelId + '/mail/filter/' + filterHandle + '/' + mailId);
        }
        else
        {
            this.location.go('pg/channel/' + this.channelId + '/mail/' + folderHandle + '/' + mailId);
        }

        // Set current mail
        this.mailService.setCurrentMail(mailId);
    }

}
