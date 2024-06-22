import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';

// -----------------------------------------------------------------------------------
// COMPONENTE DI BENVENUTO
// Questo componente viene visualizzato quando l'utente accede con successo all'applicazione.
// Implementa OnInit, un'interfaccia che espone un metodo che viene eseguito non appena il componente viene visualizzato.
// -----------------------------------------------------------------------------------
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  // -----------------------------------------------------------------------------------
  // VARIABILI PER L'UTENTE
  // Queste variabili vengono utilizzate per memorizzare l'ID e il nome utente dell'utente corrente.
  // -----------------------------------------------------------------------------------
  protected userId: string = localStorage.getItem('id') ?? '';
  protected userUsername: string = localStorage.getItem("username") || "";

  // -----------------------------------------------------------------------------------
  // COSTRUTTORE
  // Il costruttore inietta il servizio Router necessario per la navigazione tra le pagine.
  // -----------------------------------------------------------------------------------
  constructor(private router: Router) { }

  // -----------------------------------------------------------------------------------
  // METODO ngOnInit
  // Questo metodo viene eseguito non appena il componente viene visualizzato.
  // -----------------------------------------------------------------------------------
  ngOnInit(): void {
    // ...eventuali operazioni di inizializzazione
  }

  // -----------------------------------------------------------------------------------
  // METODO PER ANDARE AL PROFILO
  // Questo metodo viene chiamato quando l'utente clicca sul pulsante del profilo.
  // Naviga alla pagina del profilo dell'utente corrente.
  // -----------------------------------------------------------------------------------
  goToProfile(): void {
    this.router.navigate([`/homepage/profile/${this.userId}`]);
  }
}