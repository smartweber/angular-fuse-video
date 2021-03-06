import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { TodoService } from '../../todo.service';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import { fuseAnimations } from '../../../../../../../core/animations';

@Component({
    selector   : 'fuse-todo-main-sidenav',
    templateUrl: './main-sidenav.component.html',
    styleUrls  : ['./main-sidenav.component.scss'],
    animations : fuseAnimations
})
export class FuseTodoMainSidenavComponent implements OnInit, OnDestroy
{
    @Input() channelId: string;
    folders: any[];
    filters: any[];
    tags: any[];
    accounts: object;
    selectedAccount: string;

    onFiltersChanged: Subscription;
    onTagsChanged: Subscription;

    constructor(private todoService: TodoService, private router: Router)
    {
        // Data
        this.accounts = {
            'creapond'    : 'johndoe@creapond.com',
            'withinpixels': 'johndoe@withinpixels.com'
        };

        this.selectedAccount = 'creapond';
    }

    ngOnInit()
    {
        this.onFiltersChanged =
            this.todoService.onFiltersChanged
                .subscribe(filters => {
                    this.filters = filters;
                });

        this.onTagsChanged =
            this.todoService.onTagsChanged
                .subscribe(tags => {
                    this.tags = tags;
                });
    }

    ngOnDestroy()
    {
        this.onFiltersChanged.unsubscribe();
        this.onTagsChanged.unsubscribe();
    }

    newTodo()
    {
        this.router.navigate(['/pg/channel/' + this.channelId + '/todo/all']).then(() => {
            setTimeout(() => {
                this.todoService.onNewTodoClicked.next('');
            });
        });
    }
}
