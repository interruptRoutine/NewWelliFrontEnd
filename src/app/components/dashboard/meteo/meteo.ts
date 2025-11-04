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
  standalone: true,
  styleUrl: './meteo.css'
})
export class Meteo implements OnInit
{
  weatherTitle: string = 'Caricamento meteo...';
  weatherDesc: string = 'Attendere prego...';

  weatherIcon: string = this.getIsNight() ? 'nightlight' : 'partly_cloudy_day';
  weatherBackgroundClass: string = 'default-bg';

  private profileUrl = '/api/users/userinformation';

  constructor(
    private meteoService: MeteoService,
    private http: HttpClient
  ) {
  }

  ngOnInit(): void {
    this.loadWeather();
  }

  getIsNight(): boolean {
    const currentHour = new Date().getHours();
    // Considera notte dalle 20:00 (8 PM) fino alle 5:59 (6 AM)
    return currentHour >= 20 || currentHour < 6;
  }

  loadWeather(): void {
    const isNight = this.getIsNight();

    this.http.get<User>(this.profileUrl).subscribe({
      next: (user: User) => {
        if (user && user.city) {

          const cityName = user.city.split(',')[0].trim();

          this.meteoService.getWeatherByCity(cityName).subscribe({
            next: (data: MeteoResponse) => {
              if (data && data.current) {
                const temp = data.current.temperature;
                const code = data.current.weathercode;
                const desc = this.mapWeatherCode(code);

                // La logica ora passa 'isNight'
                const weatherVisuals = this.mapWeatherVisuals(code, isNight);
                this.weatherIcon = weatherVisuals.icon;
                this.weatherBackgroundClass = weatherVisuals.backgroundClass;

                this.weatherTitle = `${temp.toFixed(0)}°C, ${desc}`;
                this.weatherDesc = `Condizioni attuali per ${cityName}.`;

              } else {
                this.weatherTitle = 'Dati meteo non validi';
                this.weatherDesc = 'La risposta dal server era incompleta.';
                this.weatherIcon = 'error';
                this.weatherBackgroundClass = 'default-bg';
              }
            },
            error: (err) => {
              console.error("Errore nel caricare il meteo: ", err);
              this.weatherTitle = 'Meteo non disponibile';
              this.weatherDesc = `Impossibile trovare il meteo per ${cityName}.`;
              this.weatherIcon = 'error';
              this.weatherBackgroundClass = 'default-bg';
            }
          });

        } else {
          console.warn('Nessuna città trovata nel profilo utente.');
          this.weatherTitle = 'Imposta la tua città';
          this.weatherDesc = 'Vai sul tuo profilo per impostare la città.';
          this.weatherIcon = 'location_off';
          this.weatherBackgroundClass = 'default-bg';
        }
      },
      error: (err) => {
        console.error('Errore nel caricare il profilo utente', err);
        this.weatherTitle = 'Errore';
        this.weatherDesc = 'Impossibile caricare il profilo utente.';
        this.weatherIcon = 'error';
        this.weatherBackgroundClass = 'default-bg';
      }
    });
  }


  // --- MODIFICA: Funzione aggiornata per TUTTE le condizioni notturne ---
  mapWeatherVisuals(code: number, isNight: boolean): { icon: string, backgroundClass: string } {

    // Sereno / Soleggiato
    if (code >= 0 && code <= 1) {
      return isNight
        ? { icon: 'clear_night', backgroundClass: 'night-clear-bg' }
        : { icon: 'wb_sunny', backgroundClass: 'sunny-bg' };
    }
    // Parzialmente nuvoloso / Nuvoloso
    if (code >= 2 && code <= 3) {
      return isNight
        ? { icon: 'nightlight', backgroundClass: 'night-cloudy-bg' }
        : { icon: 'cloud', backgroundClass: 'cloudy-bg' };
    }
    // Nebbia
    if (code >= 45 && code <= 48) {
      return isNight
        ? { icon: 'foggy', backgroundClass: 'night-foggy-bg' }
        : { icon: 'foggy', backgroundClass: 'foggy-bg' };
    }
    // Pioggerella / Pioggia
    if ((code >= 51 && code <= 57) || (code >= 61 && code <= 67) || (code >= 80 && code <= 82)) {
      return isNight
        ? { icon: 'rainy', backgroundClass: 'night-rainy-bg' }
        : { icon: 'rainy', backgroundClass: 'rainy-bg' };
    }
    // Neve
    if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
      // Usiamo la stessa icona, ma sfondi diversi
      return isNight
        ? { icon: 'ac_unit', backgroundClass: 'night-snowy-bg' }
        : { icon: 'ac_unit', backgroundClass: 'snowy-bg' };
    }
    // Temporale
    if (code >= 95 && code <= 99) {
      // Usiamo la stessa icona, ma sfondi diversi
      return isNight
        ? { icon: 'thunderstorm', backgroundClass: 'night-stormy-bg' }
        : { icon: 'thunderstorm', backgroundClass: 'stormy-bg' };
    }

    // Default
    return isNight
      ? { icon: 'nightlight', backgroundClass: 'default-bg' }
      : { icon: 'partly_cloudy_day', backgroundClass: 'default-bg' };
  }
  // --------------------------------------------------------------------


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
