import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Dashboard } from './components/dashboard/dashboard';
import { ErrorPage } from './components/error-page/error-page';
import { News } from './components/dashboard/news/news';
import {UiConfig} from './components/ui-config/ui-config';
import {TermsPrivacy} from './components/terms-privacy/terms-privacy';
import {MoodComponent} from './components/dashboard/mood/mood.component';
import {Contatti} from './components/contatti/contatti';
import {Chisiamo} from './components/chisiamo/chisiamo';

export const routes: Routes = [
  {path: "home", component: Home},
  {path: "dashboard", component: Dashboard},
  {path: "login", component: Login},
  {path: "register", component: Register},
  {path: "news", component: News},
  {path: "ui-config", component: UiConfig},
  {path: "privacy", component: TermsPrivacy},
  {path: "contatti", component: Contatti},
  {path: "chisiamo", component: Chisiamo},
  {
    path: 'calendar',
    // Carica pigramente le rotte del calendario
    loadChildren: () => import('./components/calendar/calendar.routes')
      .then(r => r.CALENDAR_ROUTES)
  },
  {path: "mood", component: MoodComponent},

  { path: "**", component: ErrorPage}
];

