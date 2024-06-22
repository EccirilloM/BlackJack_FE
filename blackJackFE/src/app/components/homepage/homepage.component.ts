import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
// -----------------------------------------------------------------------------------
// COMPONENTE HOMEPAGE
// Questo componente gestisce la visualizzazione della homepage dell'applicazione.
// Implementa OnInit, un'interfaccia che espone un metodo che viene eseguito non appena il componente viene visualizzato.
// -----------------------------------------------------------------------------------
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  // -----------------------------------------------------------------------------------
  // VARIABILE PER LO STATO DI AUTENTICAZIONE
  // Questa variabile indica se l'utente è autenticato.
  // -----------------------------------------------------------------------------------
  protected isAuthenticated: boolean = false;

  // -----------------------------------------------------------------------------------
  // COSTRUTTORE
  // Il costruttore inietta i servizi necessari per l'autenticazione e la navigazione.
  // -----------------------------------------------------------------------------------
  constructor(public authService: AuthService, public router: Router) {
    this.authService.isAuthenticated$.subscribe(
      (isAuthenticated) => this.isAuthenticated = isAuthenticated
    );
  }
  // -----------------------------------------------------------------------------------
  // METODO ngOnInit
  // Questo metodo viene eseguito non appena il componente viene visualizzato.
  // -----------------------------------------------------------------------------------
  ngOnInit(): void {
  }
}
