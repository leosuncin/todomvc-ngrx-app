import { I18nPluralPipe, NgClass, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { LetModule } from '@ngrx/component';
import { Store } from '@ngrx/store';

import { todoActions, todoFeature, Filter } from '../state/todo.feature';

@Component({
  standalone: true,
  selector: 'todo-footer',
  imports: [NgClass, NgIf, LetModule, I18nPluralPipe],
  template: `<footer
    class="footer"
    *ngrxLet="{
      activeCount: activeCount$,
      completedCount: completedCount$,
      filter: filter$
    } as vm"
  >
    <span class="todo-count">
      <strong>{{ vm.activeCount }}</strong>
      {{ vm.activeCount | i18nPlural : itemPluralMapping['item'] }} left
    </span>
    <ul class="filters">
      <li>
        <a
          href="#/"
          [ngClass]="{ selected: vm.filter === 'all' }"
          (click)="switchFilter($event, 'all')"
        >
          All
        </a>
      </li>
      &nbsp;
      <li>
        <a
          href="#/active"
          [ngClass]="{ selected: vm.filter === 'active' }"
          (click)="switchFilter($event, 'active')"
        >
          Active
        </a>
      </li>
      &nbsp;
      <li>
        <a
          href="#/completed"
          [ngClass]="{ selected: vm.filter === 'completed' }"
          (click)="switchFilter($event, 'completed')"
        >
          Completed
        </a>
      </li>
    </ul>
    <button
      *ngIf="vm.completedCount > 0"
      type="button"
      class="clear-completed"
      (click)="clearCompleted()"
    >
      Clear completed
    </button>
  </footer>`,
})
export class FooterComponent {
  #store = inject(Store);
  activeCount$ = this.#store.select(todoFeature.selectActiveCount);
  completedCount$ = this.#store.select(todoFeature.selectCompletedCount);
  filter$ = this.#store.select(todoFeature.selectFilter);
  readonly itemPluralMapping = {
    item: {
      '=0': 'items',
      '=1': 'item',
      other: 'items',
    },
  };

  switchFilter(event: Event, filter: Filter) {
    event.preventDefault();
    this.#store.dispatch(todoActions.changeFilter(filter));
  }

  clearCompleted() {
    this.#store.dispatch(todoActions.clearAllCompleted());
  }
}
