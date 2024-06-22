import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { LoginRequest } from 'src/app/dto/request/LoginRequest';
import { LoginResponse } from 'src/app/dto/response/LoginResponse';
// -----------------------------------------------------------------------------------
// COMPONENTE DI LOGIN
// Questo componente gestisce il processo di login degli utenti.
// -----------------------------------------------------------------------------------
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  // -----------------------------------------------------------------------------------
  // VARIABILI PER IL FORM DI LOGIN
  // Queste variabili memorizzano l'username e la password inseriti dall'utente.
  // -----------------------------------------------------------------------------------
  protected username: string = '';
  protected password: string = '';
  protected showPassword: boolean = false;

  // -----------------------------------------------------------------------------------
  // COSTRUTTORE
  // Il costruttore inietta i servizi necessari per l'autenticazione, la visualizzazione di messaggi e la navigazione.
  // -----------------------------------------------------------------------------------
  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  // -----------------------------------------------------------------------------------
  // METODI PER IL LOGIN
  // Questi metodi gestiscono il processo di autenticazione degli utenti.
  // -----------------------------------------------------------------------------------
  login(): void {
    if (!this.username || !this.password) {
      this.toastr.error('Please fill all fields');
      return;
    }

    const request: LoginRequest = {
      username: this.username,
      password: this.password
    };

    this.authService.login(request).subscribe({
      next: (res: LoginResponse) => {
        console.log(res);
        this.toastr.success('Login Success!');
        // Qui puoi salvare i dettagli dell'utente come token nel localStorage o gestire la navigazione
        localStorage.setItem('id', res.userId.toString());
        localStorage.setItem('nome', res.nome);
        localStorage.setItem('cognome', res.cognome);
        localStorage.setItem('username', res.username);
        localStorage.setItem('email', res.email);
        localStorage.setItem('ruolo', res.ruolo);
        localStorage.setItem('saldo', res.saldo.toString());
        localStorage.setItem('dataNascita', res.dataNascita);
        localStorage.setItem('dataRegistrazione', res.dataRegistrazione);
        localStorage.setItem('token', `Bearer ${res.jwtToken}`);

        this.authService.setIsAuthenticated(true);

        // Assumi che l'oggetto di risposta abbia un campo jwt. Modifica per adattarsi alla tua risposta effettiva
        this.router.navigate(['/homepage/welcome']);
      },
      error: (error) => {
        this.toastr.error('Error while login!');
        console.error(error);
      }
    });
  }

  // -----------------------------------------------------------------------------------
  // METODI PER MOSTRARE LA PASSWORD
  // Questi metodi gestiscono la visualizzazione della password nel campo di input.
  // -----------------------------------------------------------------------------------
  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  // -----------------------------------------------------------------------------------
  // METODI PER LA NAVIGAZIONE AD ALTRE PAGINE
  // Questi metodi gestiscono la navigazione verso altre pagine dell'applicazione.
  // -----------------------------------------------------------------------------------
  goToRegistration(): void {
    this.router.navigate(['/registrazione']);
  }
}
