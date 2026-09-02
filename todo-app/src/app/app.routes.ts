import { Routes } from '@angular/router';
import { App } from './app';

export const routes: Routes = [
    {
        path: '', component: App,
    },
    {
        path: 'todos',
        loadComponent: () => import('./todos/todo-list/todo-list').then((m) => m.TodoList),
    },
];
