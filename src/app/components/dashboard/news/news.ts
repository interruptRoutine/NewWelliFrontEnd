import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necessario per *ngFor, *ngIf
import { FormsModule } from '@angular/forms'; // Necessario per ngModel (la search bar)
import { NewsService } from './NewsService'; // Importa il servizio



/**
 * Interfaccia per l'oggetto 'source' annidato
 */
export interface NewsSource {
  id: string | null;
  name: string;
}

/**
 * Interfaccia per il singolo articolo
 */
export interface Article {
  source: NewsSource;
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null; // L'URL dell'immagine può essere nullo
  publishedAt: string;
  content: string | null;
}

/**
 * Interfaccia per la risposta completa dell'API
 */
export interface NewsResponse {
  status: string;
  totalResults: number;
  articles: Article[];
}

// --- FINE DEI MODELLI ---


@Component({
  selector: 'app-news',
  standalone: true,
  // Importa i moduli necessari
  imports: [CommonModule, FormsModule],
  templateUrl: './news.html',
  styleUrls: ['./news.css']
})
export class News implements OnInit {

  // Proprietà per memorizzare i dati
  public articles: Article[] = []; // Ora usa l'interfaccia 'Article' definita sopra
  public searchQuery: string = '';
  public categories: string[] = ['technology', 'business', 'sports', 'health', 'science'];
  public isLoading: boolean = true; // Per mostrare un loader

  constructor(private newsService: NewsService) { }

  ngOnInit(): void {
    // Carica le notizie di default all'avvio
    this.loadNews();
  }

  /**
   * Metodo principale per caricare le notizie.
   * @param query Parola chiave
   * @param category Categoria
   */
  loadNews(query?: string, category?: string): void {
    this.isLoading = true;
    this.newsService.getNews(query, category).subscribe({
      next: (response) => { // 'response' è implicitamente di tipo 'NewsResponse'
        // Filtriamo gli articoli che non hanno un'immagine per pulizia
        this.articles = response.articles.filter(article => article.urlToImage);
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Errore nel caricare le notizie", err);
        this.isLoading = false;
      }
    });
  }

  /**
   * Chiamato quando si preme "Invio" sulla barra di ricerca.
   */
  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.loadNews(this.searchQuery.trim());
    }
  }

  /**
   * Chiamato quando si clicca su un bottone di categoria.
   * @param category Categoria selezionata
   */
  onSelectCategory(category: string): void {
    this.searchQuery = ''; // Pulisce la ricerca
    this.loadNews(undefined, category);
  }
}
