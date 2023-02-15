import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import { todoActions } from '../state/todo.feature';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule],
  selector: 'todo-header',
  template: `<header class="header">
    <h1>todos</h1>
    <input
      class="new-todo"
      placeholder="What needs to be done?"
      aria-label="Add a new todo"
      required
      name="title"
      [formControl]="titleControl"
      (keyup.enter)="createTodo()"
    />
  </header>`,
})
export class HeaderComponent {
  #store = inject(Store);

  protected titleControl = inject(FormBuilder).nonNullable.control(
    '',
    Validators.required
  );

  createTodo() {
    const title = this.titleControl.getRawValue();

    if (title.trim().length < 1) return;

    this.#store.dispatch(todoActions.add(title));

    this.titleControl.reset();
  }
}
