import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MeteoService, MeteoResponse, User } from './MeteoService';

@Component({
  selector: 'app-meteo',
  imports: [
    CommonModule,
    HttpClientModule
  ],
  templateUrl: './meteo.html',
  styleUrl: './meteo.css'
})
export class Meteo implements OnInit
{
  weatherTitle: string = 'Caricamento meteo...';
  weatherDesc: string = 'Attendere prego...';

  private profileUrl = '/api/users/userinformation';

  constructor(
    private meteoService: MeteoService,
    private http: HttpClient
  ) {
  }

  ngOnInit(): void {
    this.loadWeather();
  }

  loadWeather(): void {
    this.http.get<User>(this.profileUrl).subscribe({
      next: (user: User) => {
        if (user && user.city) {

          const cityName = user.city.split(',')[0].trim();

          this.meteoService.getWeatherByCity(cityName).subscribe({
            next: (data: MeteoResponse) => {
              if (data && data.current) {
                const temp = data.current.temperature;
                const desc = this.mapWeatherCode(data.current.weathercode);

                this.weatherTitle = `${temp.toFixed(0)}°C, ${desc}`;

                this.weatherDesc = `Condizioni attuali per ${cityName}.`;

              } else {
                this.weatherTitle = 'Dati meteo non validi';
                this.weatherDesc = 'La risposta dal server era incompleta.';
              }
            },
            error: (err) => {
              console.error("Errore nel caricare il meteo: ", err);
              this.weatherTitle = 'Meteo non disponibile';
              this.weatherDesc = `Impossibile trovare il meteo per ${cityName}.`;
            }
          });

        } else {
          console.warn('Nessuna città trovata nel profilo utente.');
          this.weatherTitle = 'Imposta la tua città';
          this.weatherDesc = 'Vai sul tuo profilo per impostare la città.';
        }
      },
      error: (err) => {
        console.error('Errore nel caricare il profilo utente', err);
        this.weatherTitle = 'Errore';
        this.weatherDesc = 'Impossibile caricare il profilo utente.';
      }
    });
  }


  mapWeatherCode(code: number): string {
    const codes: { [key: number]: string } = {
      0: 'Sereno',
      1: 'Prevalentemente sereno',
      2: 'Parzialmente nuvoloso',
      3: 'Nuvoloso',
      45: 'Nebbia',
      48: 'Nebbia ghiacciata',
      51: 'Pioggerella leggera',
      53: 'Pioggerella',
      55: 'Pioggerella intensa',
      56: 'Pioggerella gelata',
      57: 'Pioggerella gelata',
      61: 'Pioggia leggera',
      63: 'Pioggia',
      65: 'Pioggia intensa',
      66: 'Pioggia gelata',
      67: 'Pioggia gelata',
      71: 'Neve leggera',
      73: 'Neve',
      75: 'Neve intensa',
      77: 'Neve granulosa',
      80: 'Rovescio leggero',
      81: 'Rovescio',
      82: 'Rovescio violento',
      85: 'Rovescio di neve',
      86: 'Rovescio di neve intenso',
      95: 'Temporale',
      96: 'Temporale con grandine',
      99: 'Temporale con grandine'
    };
    return codes[code] || 'Condizioni sconosciute';
  }
}
