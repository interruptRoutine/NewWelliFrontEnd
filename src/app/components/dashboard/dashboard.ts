import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from "@angular/common";
import { Meteo } from "./meteo/meteo";
import { EventDataService, BackendEvent } from "../calendar/event-data.service";

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterLink,
    CommonModule,
    Meteo
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit
{
  todayEvents: BackendEvent[] = [];
  todayDate: Date = new Date();
  isLoadingEvents: boolean = true;

  constructor(
    private router: Router,
    private eventDataService: EventDataService
  ) {
  }

  ngOnInit(): void {
    this.loadTodayEvents();
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
}
