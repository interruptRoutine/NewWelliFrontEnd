import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface HoroscopeResponse {
  title: string;
  description: string;
}

export interface Phrase {
  phrase: string;
  author: string;
}

@Injectable({
  providedIn: 'root'
})
export class GeminiService {

  private horoscopeUrl = '/api/gemini/horoscope';
  private quoteUrl = "api/gemini/quote-of-the-day"

  constructor(private http: HttpClient) { }

  getDailyHoroscope(): Observable<HoroscopeResponse> {
    return this.http.get<HoroscopeResponse>(this.horoscopeUrl);
  }

  getQuoteOfTheDay(): Observable<Phrase> {
    return this.http.get<Phrase>(this.quoteUrl);
  }
}
