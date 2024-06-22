import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs';
import { Tavolo } from 'src/app/types/tavolo';
import { ToastrService } from 'ngx-toastr';
import { Ruolo } from 'src/app/types/ruolo';
// -----------------------------------------------------------------------------------
// COMPONENTE DELLA NAVBAR
// Questo componente gestisce la barra di navigazione dell'applicazione.
// Implementa OnInit, un'interfaccia che espone un metodo che viene eseguito non appena il componente viene visualizzato.
// -----------------------------------------------------------------------------------
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  // -----------------------------------------------------------------------------------
  // VARIABILI PER L'IMMAGINE PROFILO
  // Queste variabili vengono utilizzate per gestire il logo del profilo dell'utente.
  // -----------------------------------------------------------------------------------
  protected logoPath: string = 'assets/logos/BlackJackSaferLogo.png';
  // -----------------------------------------------------------------------------------
  // VARIABILI PER LA ROTTA
  // Queste variabili memorizzano la rotta corrente dell'applicazione.
  // -----------------------------------------------------------------------------------
  protected currentRoute: string = '';
  // -----------------------------------------------------------------------------------
  // VARIABILI PER L'UTENTE
  // Queste variabili memorizzano le informazioni dell'utente.
  // -----------------------------------------------------------------------------------
  protected userId: string = localStorage.getItem('id') ?? '';
  protected userNome: string = localStorage.getItem('nome') ?? '';
  protected userCognome: string = localStorage.getItem('cognome') ?? '';
  protected userUsername: string = localStorage.getItem('username') ?? '';
  protected userDisplayName: string = `@${this.userUsername}`;

  // -----------------------------------------------------------------------------------
  // VARIABILI PER IL TIPO DI TAVOLO
  // Queste variabili memorizzano il tipo di tavolo selezionato.
  // -----------------------------------------------------------------------------------
  protected Tavolo = Tavolo;

  // -----------------------------------------------------------------------------------
  // COSTRUTTORE
  // Il costruttore inietta i servizi necessari per l'autenticazione e la navigazione.
  // -----------------------------------------------------------------------------------
  constructor(private userService: UserService, private authService: AuthService, private router: Router) {
    this.currentRoute = this.router.url.split('/')[1];
  }
  // -----------------------------------------------------------------------------------
  // METODO ngOnInit
  // Questo metodo viene eseguito non appena il componente viene visualizzato.
  // -----------------------------------------------------------------------------------
  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: Event) => {
      let navigationEndEvent = event as NavigationEnd;
      this.currentRoute = navigationEndEvent.urlAfterRedirects.split('/')[1];
    });
  }

  // -----------------------------------------------------------------------------------
  // METODI PER L'AUTENTICAZIONE
  // Questi metodi gestiscono l'uscita dell'utente dall'applicazione.
  // -----------------------------------------------------------------------------------
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // -----------------------------------------------------------------------------------
  // METODI PER LA NAVIGAZIONE IN ALTRE PAGINE
  // Questi metodi gestiscono la navigazione dell'utente tra le varie sezioni dell'applicazione.
  // -----------------------------------------------------------------------------------
  goToDashboard(): void {
    this.router.navigate(['/homepage/dashboard']);
  }

  goToProfile(): void {
    this.router.navigate([`/homepage/profile/${this.userId}`]);
  }

  goToChargeMoney(): void {
    this.router.navigate(['/homepage/chargeMoney']);
  }

  goToForum(tipoTavolo: Tavolo): void {
    this.router.navigate([`/homepage/forum/${tipoTavolo}`]);
  }

  goToAdmin(): void {
    this.router.navigate(['/homepage/adminDashboard']);
  }

  goToEconomist(): void {
    this.router.navigate(['/homepage/economoDashboard']);
  }

  goToWelcome(): void {
    this.router.navigate(['/homepage/welcome']);
  }

  // -----------------------------------------------------------------------------------
  // METODI PER IL MENU DEL FORUM
  // Questi metodi gestiscono l'apertura e la chiusura del menu del forum.
  // -----------------------------------------------------------------------------------
  forumMenuOpen: boolean = false;
  toggleForumMenu(): void {
    this.forumMenuOpen = !this.forumMenuOpen;
  }

  // -----------------------------------------------------------------------------------
  // METODI PER IL RUOLO DELL'UTENTE
  // Questi metodi verificano il ruolo dell'utente per mostrare contenuti specifici.
  // -----------------------------------------------------------------------------------
  isAdmin(): boolean {
    return this.authService.getRole() === Ruolo.ADMIN;
  }

  isEconomo(): boolean {
    return this.authService.getRole() === Ruolo.ECONOMO;
  }

  isPlayer(): boolean {
    return this.authService.getRole() === Ruolo.PLAYER;
  }
}
