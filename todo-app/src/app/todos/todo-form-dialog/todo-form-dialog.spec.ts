import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { CreateTodoRequest } from '../todo.model';
import { TodoFormDialog } from './todo-form-dialog';

describe('TodoFormDialog', () => {
    let fixture: ComponentFixture<TodoFormDialog>;
    let element: HTMLElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TodoFormDialog],
        }).compileComponents();

        fixture = TestBed.createComponent(TodoFormDialog);
        element = fixture.nativeElement as HTMLElement;
        await fixture.whenStable();
    });

    function setDescription(value: string): void {
        const input = element.querySelector<HTMLInputElement>('#description')!;
        input.value = value;
        input.dispatchEvent(new Event('input'));
    }

    function setDueDate(value: string): void {
        const input = element.querySelector<HTMLInputElement>('#dueDate')!;
        input.value = value;
        input.dispatchEvent(new Event('input'));
    }

    function submit(): void {
        element.querySelector<HTMLFormElement>('form')!.dispatchEvent(new Event('submit'));
    }

    it('focuses the description input after render', () => {
        expect(document.activeElement).toBe(element.querySelector('#description'));
    });

    it('does not emit save and shows an error when description is empty', async () => {
        const saved = vi.fn();
        fixture.componentInstance.save.subscribe(saved);

        submit();
        await fixture.whenStable();

        expect(saved).not.toHaveBeenCalled();
        expect(element.textContent).toContain('Description is required.');
    });

    it('emits save with the trimmed description and no dueDate', async () => {
        const saved = vi.fn();
        fixture.componentInstance.save.subscribe(saved);

        setDescription('  Write tests  ');
        submit();
        await fixture.whenStable();

        expect(saved).toHaveBeenCalledWith({ description: 'Write tests' } as CreateTodoRequest);
    });

    it('emits save with the dueDate when provided', async () => {
        const saved = vi.fn();
        fixture.componentInstance.save.subscribe(saved);

        setDescription('Write tests');
        setDueDate('2026-09-10');
        submit();
        await fixture.whenStable();

        expect(saved).toHaveBeenCalledWith({
            description: 'Write tests',
            dueDate: '2026-09-10',
        } as CreateTodoRequest);
    });

    it('does not emit save while saving', async () => {
        const saved = vi.fn();
        fixture.componentInstance.save.subscribe(saved);
        fixture.componentRef.setInput('saving', true);

        setDescription('Write tests');
        submit();
        await fixture.whenStable();

        expect(saved).not.toHaveBeenCalled();
    });

    it('emits cancel when the cancel button is clicked', () => {
        const cancelled = vi.fn();
        fixture.componentInstance.cancel.subscribe(cancelled);

        element.querySelector<HTMLButtonElement>('button[type="button"]')!.click();

        expect(cancelled).toHaveBeenCalled();
    });
});
