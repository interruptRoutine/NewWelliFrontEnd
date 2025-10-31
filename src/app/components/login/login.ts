// File: interruptroutine/newwellifrontend/NewWelliFrontEnd-495b53553fe9ea2b80a9b940719b90ce065b5852/src/app/components/login/login.ts

import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../components/core/auth/auth.service';
import { HttpClient } from '@angular/common/http'; // HttpClientModule non serve più qui
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  // CORREZIONE: Rimosso HttpClientModule.
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  standalone: true
})
export class Login {

  @ViewChild('passwordField') passwordField!: ElementRef<HTMLInputElement>;
  @ViewChild('toggleIcon') toggleIcon!: ElementRef<HTMLElement>;

  loginData = {
    email: '',
    password: ''
  };

  errorMessage: string | null = null;
  passwordFieldType: string = 'password';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  handleLogin(): void {
    this.errorMessage = null;

    this.http.post<{ token: string }>('/api/users/login', this.loginData)
      .pipe(
        catchError((error) => {
          if (error.status === 400 || error.status === 401) { // Gestisce 400 (Bad Request) o 401 (Unauthorized)
            this.errorMessage = "Email e/o password errati o inesistenti.";
          } else {
            this.errorMessage = 'Errore di connessione. Riprova più tardi.';
          }
          return throwError(() => new Error(error.message));
        })
      )
      .subscribe(response => {
        this.authService.setToken(response.token);
        this.router.navigate(['/dashboard']);
      });
  }

  togglePasswordVisibility(): void {
    const iconElement = this.toggleIcon.nativeElement;
    const inputElement = this.passwordField.nativeElement;

    if (this.passwordFieldType === 'password') {
      this.passwordFieldType = 'text';
      iconElement.innerText = 'visibility_off'; // Icona "occhio chiuso"
    } else {
      this.passwordFieldType = 'password';
      iconElement.innerText = 'visibility'; // Icona "occhio aperto"
    }
    inputElement.type = this.passwordFieldType; // Assicurati di aggiornare il DOM
  }
}
