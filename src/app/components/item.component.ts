import { NgClass, NgIf } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LetModule } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';

import { todoActions, todoFeature, Todo } from '../state/todo.feature';

@Component({
  standalone: true,
  selector: 'todo-item[todo]',
  imports: [NgClass, NgIf, ReactiveFormsModule, LetModule],
  template: `<li
    *ngrxLet="editing$ as editing"
    [ngClass]="{ completed: todo.completed, editing }"
  >
    <div class="view">
      <input
        class="toggle"
        type="checkbox"
        #completed
        attr.aria-label="Toggle {{ todo.title }}"
        [checked]="todo.completed"
        (change)="toggle(completed.checked)"
      />
      <label (dblclick)="edit()">{{ todo.title }}</label>
      <button
        type="button"
        class="destroy"
        (click)="delete()"
        attr.aria-label="Remove {{ todo.title }}"
      ></button>
    </div>
    <input
      *ngIf="editing"
      class="edit"
      attr.aria-label="Edit {{ todo.title }}"
      [formControl]="titleControl"
      (keyup.enter)="update()"
      (keyup.esc)="cancelEdit()"
      (blur)="update()"
    />
  </li>`,
})
export class ItemComponent {
  #store = inject(Store);
  editing$ = this.#store
    .select(todoFeature.selectPickedTodoId)
    .pipe(map((currentTodoId) => currentTodoId === this.todo?.id));
  @Input() todo!: Todo;
  protected titleControl = inject(FormBuilder).nonNullable.control(
    '',
    Validators.required
  );

  toggle(completed: Todo['completed']) {
    this.#store.dispatch(todoActions.toggle({ id: this.todo.id, completed }));
  }

  delete() {
    this.#store.dispatch(todoActions.remove({ id: this.todo.id }));
  }

  edit() {
    this.#store.dispatch(todoActions.pickTodo({ id: this.todo.id }));
    this.titleControl.setValue(this.todo.title);
  }

  cancelEdit() {
    this.#store.dispatch(todoActions.clearPicked());
    this.titleControl.reset();
  }

  update() {
    const title = this.titleControl.getRawValue().trim();

    if (title !== this.todo.title && title.length > 0) {
      this.#store.dispatch(
        todoActions.changeTitle({ id: this.todo.id, title })
      );
    }

    this.cancelEdit();
  }
}
