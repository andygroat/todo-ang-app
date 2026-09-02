import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TodoFormDialog } from '../todo-form-dialog/todo-form-dialog';
import { CreateTodoRequest, Todo } from '../todo.model';
import { TodoService } from '../todo.service';

@Component({
    selector: 'app-todo-list',
    imports: [DatePipe, TodoFormDialog],
    templateUrl: './todo-list.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoList implements OnInit {
    private readonly todoService = inject(TodoService);
    private readonly destroyRef = inject(DestroyRef);

    readonly todos = signal<Todo[]>([]);
    readonly loading = signal(true);
    readonly error = signal<string | null>(null);
    readonly dialogOpen = signal(false);
    readonly saving = signal(false);

    ngOnInit(): void {
        this.load();
    }

    load(): void {
        this.loading.set(true);
        this.error.set(null);

        this.todoService
            .getTodos()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (todos) => {
                    this.todos.set(todos);
                    this.loading.set(false);
                },
                error: () => {
                    this.error.set('Unable to load todos.');
                    this.loading.set(false);
                },
            });
    }

    openDialog(): void {
        this.dialogOpen.set(true);
    }

    closeDialog(): void {
        this.dialogOpen.set(false);
    }

    onSave(request: CreateTodoRequest): void {
        this.saving.set(true);

        this.todoService
            .createTodo(request)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (todo: Todo) => {
                    this.todos.update((todos) => [...todos, todo]);
                    this.saving.set(false);
                    this.dialogOpen.set(false);
                },
                error: () => {
                    this.error.set('Unable to create the todo.');
                    this.saving.set(false);
                },
            });
    }

    onComplete(todo: Todo): void {
        this.todoService
            .completeTodo(todo.id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (updated) => {
                    // Get the todo from the list and update it with the new values.
                    const existing = this.todos().find((t) => t.id === todo.id);
                    if (!existing) {
                        this.error.set('Unable to find the todo to update.');
                        return;
                    }
                    existing.isCompleted = true;
                    this.todos.update((todos) => todos.map((t) => (t.id === existing.id ? existing : t)));
                },
                error: () => this.error.set('Unable to complete the todo.'),
            });
    }
}
