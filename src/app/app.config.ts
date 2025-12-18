import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './auth/auth.interceptor';
import { providePrimeNG } from 'primeng/config';
import Nora from '@primeng/themes/nora';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
{ provide: LocationStrategy, useClass: HashLocationStrategy },
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),

    providePrimeNG({
      theme: { preset: Nora }
    })
  ]
};
