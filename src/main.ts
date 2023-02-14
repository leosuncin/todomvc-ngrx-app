import { bootstrapApplication } from '@angular/platform-browser';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [provideStore(), provideEffects(), provideStoreDevtools()],
}).catch((err) => console.error(err));
