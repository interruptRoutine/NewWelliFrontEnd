import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EventInput } from '@fullcalendar/core';

export interface EventDto {
  id?: string;
  title: string;
  description: string;
  start: string;
  end: string;
  isAllDay: boolean;
  color: string;
  showAs: 'FREE' | 'BUSY' | 'TENTATIVE' | 'OUT_OF_OFFICE';
  recurrenceRule?: string;
  reminderMinutes?: number;
  type?: string;
}

export interface BackendEvent extends EventDto {
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventDataService {

  private apiUrl = '/api/events';

  constructor(private http: HttpClient) { }


  getEventsForRange(start: string, end: string): Observable<BackendEvent[]> {
    const params = new HttpParams()
      .set('start', start)
      .set('end', end);

    return this.http.get<BackendEvent[]>(this.apiUrl, { params });
  }


  loadEvents = (fetchInfo: any,
                successCallback: (events: EventInput[]) => void,
                failureCallback: (error: any) => void): void => {

    this.getEventsForRange(fetchInfo.startStr, fetchInfo.endStr)
      .pipe(
        map(backendEvents => this.mapBackendToFullCalendar(backendEvents))
      )
      .subscribe(
        fcEvents => successCallback(fcEvents),
        error => failureCallback(error)
      );
  }

  private mapBackendToFullCalendar(events: BackendEvent[]): EventInput[] {
    console.log('Backend Events:', events);
    const mappedEvents = events.map(e => ({
      id: e.id,
      title: e.title,
      start: e.start,
      end: e.end,
      allDay: e.isAllDay,
      color: e.color,
      rrule: e.recurrenceRule ? e.recurrenceRule : undefined,
      extendedProps: {
        description: e.description,
        showAs: e.showAs,
        type: e.type,
        reminderMinutes: e.reminderMinutes
      },
      display: e.showAs === 'OUT_OF_OFFICE' ? 'background' : 'auto',
      backgroundColor: e.showAs === 'FREE' ? '#c8e6c9' : e.color,
      borderColor: e.showAs === 'FREE' ? '#4CAF50' : e.color,
    }));
    console.log('Mapped FullCalendar Events:', mappedEvents);
    return mappedEvents;
  }

  createEvent(dto: EventDto): Observable<BackendEvent> {
    return this.http.post<BackendEvent>(this.apiUrl, dto);
  }

  updateEvent(id: string, dto: EventDto): Observable<BackendEvent> {
    return this.http.put<BackendEvent>(`${this.apiUrl}/${id}`, dto);
  }

  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
