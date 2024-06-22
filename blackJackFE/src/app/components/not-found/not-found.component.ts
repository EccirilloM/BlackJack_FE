import { Component } from '@angular/core';
import { Router } from '@angular/router';
// -----------------------------------------------------------------------------------
// COMPONENTE PER LA PAGINA NON TROVATA
// Questo componente gestisce la visualizzazione della pagina "Non Trovata" (404).
// -----------------------------------------------------------------------------------
@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent {
  // -----------------------------------------------------------------------------------
  // COSTRUTTORE
  // Il costruttore inietta il servizio Router necessario per la navigazione.
  // -----------------------------------------------------------------------------------
  constructor(private router: Router) { }

  // -----------------------------------------------------------------------------------
  // METODI PER LA NAVIGAZIONE
  // Questo metodo viene chiamato quando l'utente clicca sul pulsante per tornare alla pagina di login.
  // -----------------------------------------------------------------------------------
  goToLogin() {
    this.router.navigate(['/login']);
  }
}
