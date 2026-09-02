import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { CreateTodoRequest, Todo } from '../todo.model';
import { TodoService } from '../todo.service';
import { TodoList } from './todo-list';

class TodoServiceStub {
    todos: Todo[] = [
        { id: '1', description: 'Write tests', isCompleted: false },
        { id: '2', description: 'Ship feature', dueDate: '2026-09-10', isCompleted: true },
    ];

    getTodos(): Observable<Todo[]> {
        return of(this.todos);
    }

    createTodo(request: CreateTodoRequest): Observable<Todo> {
        return of({ id: '3', isCompleted: false, ...request });
    }

    completeTodo(id: string): Observable<Todo> {
        return of({ ...this.todos.find((t) => t.id === id)!, isCompleted: true });
    }
}

describe('TodoList', () => {
    let fixture: ComponentFixture<TodoList>;
    let element: HTMLElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TodoList],
            providers: [{ provide: TodoService, useClass: TodoServiceStub }],
        }).compileComponents();

        fixture = TestBed.createComponent(TodoList);
        await fixture.whenStable();
        element = fixture.nativeElement as HTMLElement;
    });

    it('renders the loaded todos', () => {
        const items = element.querySelectorAll('li');
        expect(items.length).toBe(2);
        expect(items[0].textContent).toContain('Write tests');
    });

    it('opens the create dialog', async () => {
        expect(element.querySelector('[role="dialog"]')).toBeNull();

        element.querySelector<HTMLButtonElement>('header button')!.click();
        await fixture.whenStable();

        expect(element.querySelector('[role="dialog"]')).not.toBeNull();
    });

    it('adds a todo when the dialog saves', async () => {
        fixture.componentInstance.onSave({ description: 'New item' });
        await fixture.whenStable();

        expect(element.querySelectorAll('li').length).toBe(3);
        expect(element.textContent).toContain('New item');
    });

    it('marks a todo as completed', async () => {
        fixture.componentInstance.onComplete(fixture.componentInstance.todos()[0]);
        await fixture.whenStable();

        expect(fixture.componentInstance.todos()[0].isCompleted).toBe(true);
        expect(element.querySelectorAll('li')[0].textContent).toContain('Completed');
    });
});
