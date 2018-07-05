import {
    Component,
    OnDestroy,
    OnInit,
    ChangeDetectorRef
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { TodoService } from './todo.service';
import { FormControl } from '@angular/forms';
import { Todo } from './todo.model';
import { fuseAnimations } from '../../../../../core/animations';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import {
    Router,
    ActivatedRoute,
    NavigationEnd
} from '@angular/router';
import { ChannelService } from '../channel.service';

@Component({
    selector   : 'fuse-todo',
    templateUrl: './todo.component.html',
    styleUrls  : ['./todo.component.scss'],
    animations : fuseAnimations
})
export class FuseTodoComponent implements OnInit, OnDestroy
{
    hasSelectedTodos: boolean;
    isIndeterminate: boolean;
    filters: any[];
    tags: any[];
    breadcrumbs: Object[];
    channelId: string;
    channelAbstact: string;
    channelName: string;

    searchInput: FormControl;
    currentTodo: Todo;

    onSelectedTodosChanged: Subscription;
    onFiltersChanged: Subscription;
    onTagsChanged: Subscription;
    onCurrentTodoChanged: Subscription;

    constructor(
        private todoService: TodoService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private channelService: ChannelService,
        private cdRef: ChangeDetectorRef
    )
    {
        this.channelAbstact = '';
        this.channelName = '';
        this.searchInput = new FormControl('');
    }

    ngOnInit()
    {
        this.getChannelData();

        this.router.events.forEach((event) => {
            if(event instanceof NavigationEnd) {
                this.getChannelData();
            }
        });

        this.onSelectedTodosChanged =
            this.todoService.onSelectedTodosChanged
                .subscribe(selectedTodos => {

                    setTimeout(() => {
                        this.hasSelectedTodos = selectedTodos.length > 0;
                        this.isIndeterminate = (selectedTodos.length !== this.todoService.todos.length && selectedTodos.length > 0);
                    }, 0);
                });

        this.onFiltersChanged =
            this.todoService.onFiltersChanged
                .subscribe(folders => {
                    this.filters = this.todoService.filters;
                });

        this.onTagsChanged =
            this.todoService.onTagsChanged
                .subscribe(tags => {
                    this.tags = this.todoService.tags;
                });

        this.searchInput.valueChanges
            .debounceTime(300)
            .distinctUntilChanged()
            .subscribe(searchText => {
                this.todoService.onSearchTextChanged.next(searchText);
            });

        this.onCurrentTodoChanged =
            this.todoService.onCurrentTodoChanged
                .subscribe(([currentTodo, formType]) => {
                    if ( !currentTodo )
                    {
                        this.currentTodo = null;
                    }
                    else
                    {
                        this.currentTodo = currentTodo;
                    }
                });
    }

    deSelectCurrentTodo()
    {
        this.todoService.onCurrentTodoChanged.next([null, null]);
    }

    ngOnDestroy()
    {
        this.onSelectedTodosChanged.unsubscribe();
        this.onFiltersChanged.unsubscribe();
        this.onTagsChanged.unsubscribe();
        this.onCurrentTodoChanged.unsubscribe();
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
                url: '/pg/channel/' + this.channelId + '/todo/all',
                label: 'Tasks'
            });

            if (!this.cdRef['destroyed']) {
                this.cdRef.detectChanges();
            }
        }
    }

    toggleSelectAll()
    {
        this.todoService.toggleSelectAll();
    }

    selectTodos(filterParameter?, filterValue?)
    {
        this.todoService.selectTodos(filterParameter, filterValue);
    }

    deselectTodos()
    {
        this.todoService.deselectTodos();
    }

    toggleTagOnSelectedTodos(tagId)
    {
        this.todoService.toggleTagOnSelectedTodos(tagId);
    }

}
