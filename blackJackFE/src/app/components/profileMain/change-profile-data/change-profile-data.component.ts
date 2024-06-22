import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service'; // Aggiusta con il percorso corretto del tuo servizio
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

// -----------------------------------------------------------------------------------
// COMPONENTE PER LA MODIFICA DEI DATI DEL PROFILO
// Questo componente gestisce la modifica dei dati del profilo dell'utente.
// Implementa OnInit, un'interfaccia che espone un metodo che viene eseguito non appena il componente viene visualizzato.
// -----------------------------------------------------------------------------------
@Component({
  selector: 'app-change-profile-data',
  templateUrl: './change-profile-data.component.html',
  styleUrls: ['./change-profile-data.component.css']
})
export class ChangeProfileDataComponent implements OnInit {
  // -----------------------------------------------------------------------------------
  // VARIABILI PER I DATI UTENTE
  // Queste variabili vengono utilizzate per memorizzare e aggiornare i dati del profilo dell'utente.
  // -----------------------------------------------------------------------------------
  protected userData = {
    nome: localStorage.getItem('nome') || '',
    cognome: localStorage.getItem('cognome') || '',
    email: localStorage.getItem('email') || '',
    username: localStorage.getItem('username') || '',
    vecchiaPassword: '',
    nuovaPassword: '',
  };

  // -----------------------------------------------------------------------------------
  // COSTRUTTORE
  // Il costruttore inietta i servizi necessari per l'aggiornamento dei dati utente e la navigazione.
  // -----------------------------------------------------------------------------------
  constructor(private userService: UserService, private toastr: ToastrService, private router: Router) { }

  // -----------------------------------------------------------------------------------
  // METODO ngOnInit
  // Questo metodo viene eseguito non appena il componente viene visualizzato.
  // -----------------------------------------------------------------------------------
  ngOnInit(): void {
    console.log("ChangeProfileDataComponent initialized");
  }

  // -----------------------------------------------------------------------------------
  // METODO PER L'AGGIORNAMENTO DATI UTENTE
  // Esegue la richiesta di aggiornamento dei dati utente al servizio UserService.
  // -----------------------------------------------------------------------------------
  aggiornaDatiUtente() {
    if (!this.userData.vecchiaPassword) {
      this.toastr.error('The old password is required.');
      return;
    }

    this.userService.aggiornaDatiUtente(this.userData.nome, this.userData.cognome, this.userData.email, this.userData.username, this.userData.vecchiaPassword, this.userData.nuovaPassword)
      .subscribe({
        next: (res) => {
          this.toastr.success("Data updated successfully");
          this.userData.vecchiaPassword = '';
          this.userData.nuovaPassword = '';
          this.router.navigateByUrl('/login').then(() => {
            this.toastr.info("Please login again with your new credentials.");
          });
        },
        error: (err: HttpErrorResponse) => {
          this.toastr.error(err.error.message);
          this.userData.vecchiaPassword = '';
          this.userData.nuovaPassword = '';
          this.toastr.info(err.error.message);
        }
      });
  }
}

