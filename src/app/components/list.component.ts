import { NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { LetModule } from '@ngrx/component';
import { Store } from '@ngrx/store';

import { todoActions, todoFeature } from '../state/todo.feature';
import { ItemComponent } from './item.component';

@Component({
  standalone: true,
  selector: 'todo-list',
  imports: [LetModule, NgFor, NgIf, ItemComponent],
  template: `<section class="main">
    <input
      id="toggle-all"
      class="toggle-all"
      type="checkbox"
      aria-label="Toggle all"
      #completed
      *ngrxLet="activeCount$ as activeCount"
      [checked]="activeCount === 0"
      (change)="toggleAll(completed.checked)"
    />
    <label for="toggle-all" aria-label="Toggle all"></label>
    <ul
      class="todo-list"
      *ngrxLet="filteredTodos$ as filteredTodos; suspenseTpl: loading"
    >
      <todo-item *ngFor="let todo of filteredTodos" [todo]="todo" />
    </ul>
    <ng-template #loading>
      <div class="todo-list"><div class="view">Loading...</div></div>
    </ng-template>
  </section>`,
})
export class ListComponent {
  #store = inject(Store);
  filteredTodos$ = this.#store.select(todoFeature.selectFilteredTodos);
  activeCount$ = this.#store.select(todoFeature.selectActiveCount);

  toggleAll(completed: boolean) {
    this.#store.dispatch(todoActions.toggleAll({ completed }));
  }
}
