import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'todo-root',
  template: '<div class="todoapp"><h1>{{ title }}</h1></div>',
})
export class AppComponent {
  title = 'todos';
}
