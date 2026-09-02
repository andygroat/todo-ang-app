import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CreateTodoRequest, Todo } from './todo.model';

@Injectable({ providedIn: 'root' })
export class TodoService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = `${environment.apiUrl}/todos`;

    getTodos(): Observable<Todo[]> {
        return this.http.get<Todo[]>(this.baseUrl);
    }

    createTodo(request: CreateTodoRequest): Observable<Todo> {
        return this.http.post<Todo>(this.baseUrl, request);
    }

    completeTodo(id: string): Observable<Todo> {
        return this.http.patch<Todo>(`${this.baseUrl}/${encodeURIComponent(id)}/complete`, {});
    }
}
