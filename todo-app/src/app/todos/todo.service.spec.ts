import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { Todo } from './todo.model';
import { TodoService } from './todo.service';

describe('TodoService', () => {
    let service: TodoService;
    let httpMock: HttpTestingController;
    const baseUrl = `${environment.apiUrl}/todos`;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()],
        });

        service = TestBed.inject(TodoService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => httpMock.verify());

    it('gets todos', () => {
        const expected: Todo[] = [{ id: '1', description: 'Write tests', isCompleted: false }];
        let actual: Todo[] | undefined;

        service.getTodos().subscribe((todos) => (actual = todos));

        const req = httpMock.expectOne(baseUrl);
        expect(req.request.method).toBe('GET');
        req.flush(expected);

        expect(actual).toEqual(expected);
    });

    it('creates a todo', () => {
        service.createTodo({ description: 'Buy milk', dueDate: '2026-09-10' }).subscribe();

        const req = httpMock.expectOne(baseUrl);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({ description: 'Buy milk', dueDate: '2026-09-10' });
        req.flush({ id: '2', description: 'Buy milk', dueDate: '2026-09-10', isCompleted: false });
    });

    it('completes a todo', () => {
        service.completeTodo('a b').subscribe();

        const req = httpMock.expectOne(`${baseUrl}/a%20b/complete`);
        expect(req.request.method).toBe('PATCH');
        req.flush({ id: 'a b', description: 'Done', isCompleted: true });
    });
});
