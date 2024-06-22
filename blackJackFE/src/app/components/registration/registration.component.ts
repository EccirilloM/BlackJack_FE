import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { RegistrazioneRequest } from 'src/app/dto/request/RegistrazioneRequest';
import { MessageResponse } from 'src/app/dto/response/MessageResponse';
import { HttpErrorResponse } from '@angular/common/http';

// -----------------------------------------------------------------------------------
// COMPONENTE DI REGISTRAZIONE
// Questo componente gestisce la registrazione di un nuovo utente nell'applicazione.
// Implementa OnInit, un'interfaccia che espone un metodo che viene eseguito non appena il componente viene visualizzato.
// -----------------------------------------------------------------------------------
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {

  // -----------------------------------------------------------------------------------
  // VARIABILI PER LA REGISTRAZIONE
  // Queste variabili vengono utilizzate per memorizzare i dati inseriti dall'utente nel form di registrazione.
  // -----------------------------------------------------------------------------------
  protected nome = '';
  protected cognome = '';
  protected email = '';
  protected username = '';
  protected password = '';
  protected passwordRipetuta = '';
  protected dataNascita = ''; // Assicurati di gestire correttamente la formattazione della data per il backend
  protected showPassword = false;
  protected showRepeatPassword = false;

  // -----------------------------------------------------------------------------------
  // COSTRUTTORE
  // Il costruttore inietta i servizi necessari per la registrazione, visualizzazione di messaggi e navigazione.
  // -----------------------------------------------------------------------------------
  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  // -----------------------------------------------------------------------------------
  // METODO PER LA REGISTRAZIONE
  // Esegue la validazione dei campi e invia i dati di registrazione al servizio di autenticazione.
  // -----------------------------------------------------------------------------------
  register(): void {
    // Validazione semplice. Potresti voler aggiungere validazioni più specifiche
    if (!this.nome || !this.cognome || !this.email || !this.username || !this.password || !this.passwordRipetuta || !this.dataNascita) {
      this.toastr.error('Please fill all fields');
      return;
    }

    if (this.password !== this.passwordRipetuta) {
      this.toastr.error('Passwords do not match');
      return;
    }

    const request: RegistrazioneRequest = {
      nome: this.nome,
      cognome: this.cognome,
      email: this.email,
      username: this.username,
      password: this.password,
      dataNascita: new Date(this.dataNascita)
    };

    this.authService.registrazione(request).subscribe({
      next: (res: MessageResponse) => {
        this.toastr.success(res.message);
        this.router.navigateByUrl('/login');
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.toastr.error(err.error.message || 'Errore durante la registration');
      }
    });
  }

  // -----------------------------------------------------------------------------------
  // METODi PER MOSTRARE/NASCONDERE LE PASSWORD
  // Questi metodi vengono chiamati quando l'utente clicca sull'icona per mostrare o nascondere la password.
  // -----------------------------------------------------------------------------------
  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleShowRepeatPassword(): void {
    this.showRepeatPassword = !this.showRepeatPassword;
  }

  // -----------------------------------------------------------------------------------
  // METODO PER NAVIGARE ALLA PAGINA DI LOGIN
  // Questo metodo viene chiamato quando l'utente clicca sul pulsante per navigare alla pagina di login.
  // -----------------------------------------------------------------------------------
  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}