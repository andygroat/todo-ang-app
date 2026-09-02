import { ChangeDetectionStrategy, Component, ElementRef, afterNextRender, input, output, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { inject } from '@angular/core';
import { CreateTodoRequest } from '../todo.model';

@Component({
    selector: 'app-todo-form-dialog',
    imports: [ReactiveFormsModule],
    templateUrl: './todo-form-dialog.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoFormDialog {
    private readonly fb = inject(FormBuilder);

    readonly saving = input(false);
    readonly save = output<CreateTodoRequest>();
    readonly cancel = output<void>();

    private readonly descriptionInput = viewChild<ElementRef<HTMLInputElement>>('descriptionInput');

    readonly form = this.fb.nonNullable.group({
        description: ['', [Validators.required, Validators.maxLength(200)]],
        dueDate: [''],
    });

    constructor() {
        afterNextRender(() => this.descriptionInput()?.nativeElement.focus());
    }

    onSubmit(): void {
        if (this.form.invalid || this.saving()) {
            this.form.markAllAsTouched();
            return;
        }

        const { description, dueDate } = this.form.getRawValue();
        this.save.emit({
            description: description.trim(),
            ...(dueDate ? { dueDate } : {}),
        });
    }

    onCancel(): void {
        this.cancel.emit();
    }
}
