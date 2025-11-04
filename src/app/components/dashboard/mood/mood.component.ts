import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoodService } from './mood.service';

@Component({
  selector: 'app-mood',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mood.component.html',
  styleUrls: ['./mood.component.css']
})
export class MoodComponent {
  @Output() moodSubmitted = new EventEmitter<void>();

  selectedMood: string = '';
  isSubmitting: boolean = false;
  submitError: string = '';

  moods = [
    { value: 'HAPPY', icon: '😄' },
    { value: 'PEACEFUL', icon: '😌' },
    { value: 'NEUTRAL', icon: '😐' },
    { value: 'SAD', icon: '😔' },
    { value: 'ANGRY', icon: '😠' },
    { value: 'ANXIOUS', icon: '😰'}
  ];

  constructor(private moodService: MoodService) {}

  selectMood(mood: string): void {
    if (this.isSubmitting) return;
    this.selectedMood = mood;
    this.submitError = '';
  }

  submitMood(): void {
    if (!this.selectedMood || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';

    this.moodService.setMood({ mood: this.selectedMood }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.moodSubmitted.emit();
      },
      error: (err) => {
        console.error("Errore nell'invio del mood: ", err);
        this.isSubmitting = false;
        this.submitError = 'Errore nel salvataggio. Riprova.';
      }
    });
  }
}
