import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Home} from './components/home/home';
import {Login} from './components/login/login';
import {Register} from './components/register/register';
import {UiConfig} from './components/ui-config/ui-config';
import {ErrorPage} from './components/error-page/error-page';
import {CalendarViewComponent} from './components/calendar/calendar-view/calendar-view.component';
import {EventModalComponent} from './components/calendar/event-modal/event-modal.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Home, Login, Register, UiConfig, ErrorPage, CalendarViewComponent, EventModalComponent],
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('WelliProvaFront');
}
