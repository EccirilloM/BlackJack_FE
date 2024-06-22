import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
// -----------------------------------------------------------------------------------
// COMPONENTE DELLA BARRA LATERALE DEL PROFILO
// Questo componente gestisce la barra laterale del profilo utente per la navigazione.
// Implementa OnInit, un'interfaccia che espone un metodo che viene eseguito non appena il componente viene visualizzato.
// -----------------------------------------------------------------------------------
@Component({
  selector: 'app-profile-side-bar',
  templateUrl: './profile-side-bar.component.html',
  styleUrls: ['./profile-side-bar.component.css']
})
export class ProfileSideBarComponent implements OnInit {
  // -----------------------------------------------------------------------------------
  // VARIABILI PER IL SUBPATH CORRENTE
  // Queste variabili vengono utilizzate per memorizzare il sottopercorso corrente nella barra laterale del profilo.
  // -----------------------------------------------------------------------------------
  protected currentSubPath: string = '';

  // -----------------------------------------------------------------------------------
  // COSTRUTTORE
  // Il costruttore inietta i servizi necessari per la navigazione e l'attivazione delle rotte.
  // -----------------------------------------------------------------------------------
  constructor(private router: Router, private route: ActivatedRoute) { }

  // -----------------------------------------------------------------------------------
  // METODO ngOnInit
  // Questo metodo viene eseguito non appena il componente viene visualizzato.
  // -----------------------------------------------------------------------------------
  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Aggiorna currentSubPath in base al percorso corrente
      const fullPath = this.router.url.split('/');
      this.currentSubPath = fullPath[fullPath.length - 1];
    });
  }

  // -----------------------------------------------------------------------------------
  // METODI PER LA NAVIGAZIONE IN ALTRE PAGINE
  // Questo metodo viene chiamato quando l'utente clicca su un elemento della barra laterale per navigare.
  // -----------------------------------------------------------------------------------
  navigateTo(subPath: string): void {
    // Naviga verso il sottopercorso relativo all'interno del profilo
    this.router.navigate([subPath], { relativeTo: this.route });
  }
}

