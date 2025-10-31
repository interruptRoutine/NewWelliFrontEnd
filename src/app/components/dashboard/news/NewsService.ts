import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NewsResponse } from './news'; // Importa il modello

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  // URL del tuo backend Spring Boot
  private apiUrl = '/api/news/headlines';

  constructor(private http: HttpClient) { }

  /**
   * Chiama il backend per ottenere le notizie.
   * @param query La parola chiave per la ricerca (usa /everything)
   * @param category La categoria (usa /top-headlines)
   */
  getNews(query?: string, category?: string): Observable<NewsResponse> {

    let params = new HttpParams();

    // Aggiungi i parametri solo se sono definiti
    if (query) {
      params = params.set('q', query);
    }
    if (category) {
      params = params.set('category', category);
    }

    // Esegui la chiamata GET
    return this.http.get<NewsResponse>(this.apiUrl, { params });
  }
}
