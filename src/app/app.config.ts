import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

// 1. IMPORTA TUTTO QUELLO CHE SERVE
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideNativeDateAdapter } from '@angular/material/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    // 2. AGGIUNGI QUESTI TRE PROVIDER
    provideHttpClient(),    // Per EventDataService e MoodService
    provideAnimations(),    // Per MatDialog e MatDatepicker
    provideNativeDateAdapter() // Per MatDatepicker
  ]
};
