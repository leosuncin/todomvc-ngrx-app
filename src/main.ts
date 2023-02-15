import { bootstrapApplication } from '@angular/platform-browser';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { AppComponent } from './app/app.component';
import { todoFeature } from './app/state/todo.feature';

bootstrapApplication(AppComponent, {
  providers: [
    provideStore({ [todoFeature.name]: todoFeature.reducer }),
    provideEffects(),
    provideStoreDevtools(),
  ],
}).catch((err) => console.error(err));
