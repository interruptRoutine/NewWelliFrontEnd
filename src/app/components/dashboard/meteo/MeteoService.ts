import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CurrentWeather {
  temperature: number;
  weathercode: number;
  description: string;
}

export interface MeteoResponse {
  current: CurrentWeather;
}


export interface User {
  id: number;
  name: string;
  lastname: string;
  email: string;
  username: string;
  city: string;
}

@Injectable({
  providedIn: 'root'
})
export class MeteoService {

  private apiUrl = '/api/meteo/city';

  constructor(private http: HttpClient) { }


  getWeatherByCity(city: string): Observable<MeteoResponse> {

    let params = new HttpParams()
      .set('name', city);

    return this.http.get<MeteoResponse>(this.apiUrl, { params });
  }
}
