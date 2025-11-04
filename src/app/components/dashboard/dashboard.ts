import {Component, OnDestroy, OnInit} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from "@angular/common";
import { Meteo } from "./meteo/meteo";
import { EventDataService, BackendEvent } from "../calendar/event-data.service";
import {AuthService} from '../core/auth/auth.service';
import {UserDto, UserService} from '../../services/user.service';
import {GeminiService, HoroscopeResponse} from '../../services/gemini.service';
import {WidgetSettings, WidgetSettingsService} from '../../services/widget-settings.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterLink,
    CommonModule,
    Meteo,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})


export class Dashboard implements OnInit, OnDestroy
{
  isChatOpen: boolean = false;
  
  widgetSettings!: WidgetSettings;
  private settingsSub!: Subscription;

  todayEvents: BackendEvent[] = [];
  todayDate: Date = new Date();
  isLoadingEvents: boolean = true;

  userName: string = 'Utente';

  horoscopeTitle: string = 'Caricamento...';
  horoscopeDescription: string = 'Sto consultando le stelle...';
  horoscopeError: boolean = false;

  constructor(
    private router: Router,
    private eventDataService: EventDataService,
    private authService: AuthService,
    private userService: UserService,
    private geminiService: GeminiService,
    private widgetSettingsService: WidgetSettingsService
  ) {
  }

  ngOnDestroy(): void {
    if (this.settingsSub) {
      this.settingsSub.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.loadSavedTheme();
    this.loadTodayEvents();
    this.loadUserName();
    this.loadHoroscope();

    this.settingsSub = this.widgetSettingsService.settings$.subscribe(settings => {
      this.widgetSettings = settings;
    });

  }

  loadHoroscope(): void {
    this.horoscopeError = false;
    this.geminiService.getDailyHoroscope().subscribe({
      next: (response: HoroscopeResponse) => {
        this.horoscopeTitle = response.title;
        this.horoscopeDescription = response.description;
      },
      error: (err) => {
        console.error("Errore nel caricare l'oroscopo: ", err);
        this.horoscopeTitle = 'Oroscopo';
        this.horoscopeDescription = 'Non è stato possibile caricare l\'oroscopo di oggi. Riprova più tardi.';
        this.horoscopeError = true;
      }
    });
  }

  toggleChat(): void {
    this.isChatOpen = !this.isChatOpen;
    // Aggiungiamo un log per il debug
    console.log("Stato Chat aggiornato:", this.isChatOpen);
  }

  closeChat(): void {
    this.isChatOpen = false;
  }

  loadUserName(): void {
    this.userService.getUserInfo().subscribe({
      next: (user: UserDto) => {
        if (user && user.name) {
          this.userName = user.name;
        }
      },
      error: (err) => {
        console.error("Errore nel caricare le informazioni utente: ", err);
      }
    });
  }

  loadTodayEvents(): void {
    this.isLoadingEvents = true;


    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0).toISOString();
    const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59).toISOString();


    this.eventDataService.getEventsForRange(todayStart, todayEnd).subscribe({

      next: (allEvents: BackendEvent[]) => {


        const todayStartTime = new Date(todayStart).getTime();
        const todayEndTime = new Date(todayEnd).getTime();

        if (!allEvents) {
          allEvents = [];
        }

        this.todayEvents = allEvents.filter(event => {
          const eventStart = new Date(event.start).getTime();
          return eventStart >= todayStartTime && eventStart <= todayEndTime;
        });

        this.todayEvents.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

        this.isLoadingEvents = false;
      },
      error: (err) => {
        console.error("Errore nel caricare gli eventi del calendario: ", err);
        this.isLoadingEvents = false;
      }
    });
  }


  trackEventById(index: number, event: BackendEvent): string {
    return event.id;
  }

  openPage(URI: string) {
    this.router.navigate(["/" + URI])
  }

  logout(): void {
    this.authService.clearToken();
    this.router.navigate(['/home']);
  }
}
