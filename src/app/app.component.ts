import { Component } from '@angular/core';
import { FooterComponent } from './components/footer.component';
import { HeaderComponent } from './components/header.component';
import { ListComponent } from './components/list.component';

@Component({
  standalone: true,
  selector: 'todo-root',
  imports: [HeaderComponent, ListComponent, FooterComponent],
  template:
    '<div class="todoapp"><todo-header /><todo-list /><todo-footer /></div>',
})
export class AppComponent {}
