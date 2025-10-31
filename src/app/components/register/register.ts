// File: interruptroutine/newwellifrontend/NewWelliFrontEnd-495b53553fe9ea2b80a9b940719b90ce065b5852/src/app/components/register/register.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../components/core/auth/auth.service';
import { Observable, of } from 'rxjs';
import { map, startWith, catchError, debounceTime, distinctUntilChanged } from 'rxjs/operators';

// Validatori custom (inclusi per completezza, nessuna modifica qui)
export function passwordMatcher(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { passwordMismatch: true };
  }
  return null;
}
export function ageValidator(minAge: number): (control: AbstractControl) => ValidationErrors | null {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const birthDate = new Date(control.value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= minAge ? null : { underAge: { requiredAge: minAge } };
  };
}

// --- INIZIO MODIFICHE ---

// Definiamo un'interfaccia per l'oggetto città
interface City {
  name: string;      // Es. "Roma"
  country: string;   // Es. "Italy"
  display: string;   // Es. "Roma, Italy"
}

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
  standalone: true
})
export class Register implements OnInit {

  registerForm!: FormGroup;
  errorMessage: string | null = null;
  passwordFieldType: string = 'password';
  confirmPasswordFieldType: string = 'password';

  // allCities ora è un array di oggetti City
  allCities: City[] = [];
  // filteredCities$ ora emette array di oggetti City
  filteredCities$!: Observable<City[]>;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Carica la lista delle città da cities5000.json
    this.http.get<{ name: string, country: string }[]>('assets/cities5000.json').subscribe(cities => {
      // Usiamo una Map per gestire duplicati di 'display' se esistono
      const cityMap = new Map<string, City>();
      for (const city of cities) {
        if (city.name && city.country) { // Assicurati che i dati non siano nulli
          const display = `${city.name}, ${city.country}`;
          if (!cityMap.has(display)) {
            cityMap.set(display, { name: city.name, country: city.country, display: display });
          }
        }
      }
      // Converti la mappa in array e ordinala per 'display'
      this.allCities = [...cityMap.values()].sort((a, b) => a.display.localeCompare(b.display));
    });

    // Regex della password (invariata)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&-])[A-Za-z\d@$!%*?&-]{8,}$/;

    // Form (invariato)
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(passwordRegex)]],
      confirmPassword: ['', Validators.required],
      gender: ['', Validators.required],
      dob: ['', [Validators.required, ageValidator(18)]],
      city: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    }, {
      validators: passwordMatcher
    });

    // Logica per l'autocomplete (ora filtra oggetti City)
    this.filteredCities$ = this.registerForm.get('city')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      map(value => this._filterCities(value || ''))
    );
  }

  // Funzione privata per filtrare (ora ritorna City[])
  private _filterCities(value: string): City[] {
    const filterValue = value.toLowerCase();
    // Non cercare se l'input è troppo corto
    if (!filterValue || filterValue.length < 2) return [];

    return this.allCities
      .filter(city => city.display.toLowerCase().startsWith(filterValue))
      .slice(0, 10); // Mostra solo i primi 10 risultati
  }

  // Funzione per selezionare (ora riceve un oggetto City)
  selectCity(city: City): void {
    // Imposta il *nome* della città (es. "Roma") nel form control
    // Il backend si aspetta solo il nome della città, non la nazione
    this.registerForm.get('city')!.setValue(city.display);
    // Nascondi il dropdown
    this.filteredCities$ = of([]);
  }

  // Riavvia il filtro (invariato)
  resetCityFilter(): void {
    this.filteredCities$ = this.registerForm.get('city')!.valueChanges.pipe(
      startWith(this.registerForm.get('city')!.value || ''),
      map(value => this._filterCities(value || ''))
    );
  }

  // Gestisce l'invio del form (LOGICA VALIDAZIONE GIÀ PRESENTE)
  handleRegister(): void {
    this.errorMessage = null;

    // REQUISITO 2: Se il form è invalido, mostra gli errori
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    // REQUISITO 3: Se valido, invia i dati
    // Rimuovi 'confirmPassword' e 'terms' dal DTO
    const { confirmPassword, terms, ...registerDto } = this.registerForm.value;

    // NOTA: 'registerDto.city' conterrà già solo il nome (es. "Roma")
    // grazie alla logica in 'selectCity'.

    this.http.post<{ token: string }>('/api/users/register', registerDto)
      .pipe(
        catchError((error) => {
          if (error.status === 400) {
            if (error.error && error.error.includes("Email already used")) {
              this.errorMessage = "Questa email è già stata utilizzata.";
              this.f['email'].setErrors({ inUse: true });
            } else if (error.error && error.error.includes("Password not valid")) {
              this.errorMessage = "La password non rispetta i requisiti.";
              this.f['password'].setErrors({ backendInvalid: true });
            } else {
              this.errorMessage = "Dati non validi. Controlla i campi.";
            }
          } else {
            this.errorMessage = 'Errore di connessione. Riprova più tardi.';
          }
          return of(null);
        })
      )
      .subscribe(response => {
        // REQUISITO 3: In caso di successo, salva il token e naviga
        if (response) {
          this.authService.setToken(response.token);
          this.router.navigate(['/dashboard']);
        }
      });
  }

  // Helper (invariato)
  get f() { return this.registerForm.controls; }

  // Toggle password (invariato)
  togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    } else {
      this.confirmPasswordFieldType = this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
    }
  }
}
