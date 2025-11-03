import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface HoroscopeResponse {
  title: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class GeminiService {

  private horoscopeUrl = '/api/gemini/horoscope';

  constructor(private http: HttpClient) { }

  getDailyHoroscope(): Observable<HoroscopeResponse> {
    return this.http.get<HoroscopeResponse>(this.horoscopeUrl);
  }
}
