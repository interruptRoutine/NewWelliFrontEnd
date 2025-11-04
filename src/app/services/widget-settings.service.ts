import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface WidgetSettings {
  showHoroscope: boolean;
  showMeteo: boolean;
  showPlaylist: boolean;
  showReminders: boolean;
  showAiChat: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class WidgetSettingsService {

  private storageKey = 'widgetSettings';

  private defaultSettings: WidgetSettings = {
    showHoroscope: true,
    showMeteo: true,
    showPlaylist: true,
    showReminders: true,
    showAiChat: true
  };

  private settingsSubject: BehaviorSubject<WidgetSettings>;
  public settings$: Observable<WidgetSettings>;

  constructor() {
    const savedSettings = localStorage.getItem(this.storageKey);
    const initialSettings = savedSettings ? (JSON.parse(savedSettings) as WidgetSettings) : this.defaultSettings;

    const completeSettings = { ...this.defaultSettings, ...initialSettings };

    this.settingsSubject = new BehaviorSubject<WidgetSettings>(completeSettings);
    this.settings$ = this.settingsSubject.asObservable();
  }

  getSettings(): WidgetSettings {
    return this.settingsSubject.getValue();
  }

  saveSettings(settings: WidgetSettings): void {
    localStorage.setItem(this.storageKey, JSON.stringify(settings));
    this.settingsSubject.next(settings); // Notifica a tutti i subscribers
  }
}
