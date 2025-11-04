import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MoodRequestDTO } from './mood.types';

//const API_BASE = '/api/users';

@Injectable({ providedIn: 'root' })
export class MoodService {
  private http = inject(HttpClient);

  setMood(payload: MoodRequestDTO): Observable<any> {
    //return this.http.post<any>(`${API_BASE}/mood`, payload);
    return this.http.post<any>(`/api/users/mood`, payload);
  }
}
