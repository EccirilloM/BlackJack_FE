import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { getAllManiResponse } from 'src/app/dto/response/GetAllManiResponse';
import { GetUserDataResponse } from 'src/app/dto/response/GetUserDataResponse';
import { NotificaResponse } from 'src/app/dto/response/NotificaResponse';
import { ManoService } from 'src/app/services/mano.service';
import { NotificheService } from 'src/app/services/notifiche.service';
import { UserService } from 'src/app/services/user.service';
import { ChartService } from 'src/app/services/chart.service';
// -----------------------------------------------------------------------------------
// COMPONENTE PER LE INFORMAZIONI PERSONALI
// Questo componente gestisce la visualizzazione e la gestione delle informazioni personali dell'utente.
// Implementa OnInit, un'interfaccia che espone un metodo che viene eseguito non appena il componente viene visualizzato.
// -----------------------------------------------------------------------------------
@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.css']
})
export class PersonalInfoComponent implements OnInit {
  // -----------------------------------------------------------------------------------
  // VARIABILI PER IL GRAFICO
  // Queste variabili vengono utilizzate per gestire il grafico delle mani vinte e perse.
  // -----------------------------------------------------------------------------------
  @ViewChild('chartContainer') chartContainer!: ElementRef;
  // -----------------------------------------------------------------------------------
  // VARIABILI PER IL SALDO
  // Queste variabili vengono utilizzate per gestire e visualizzare il saldo dell'utente.
  // -----------------------------------------------------------------------------------
  protected saldoString: string = localStorage.getItem('saldo') || '0';
  protected saldo: number = parseFloat(this.saldoString);
  // -----------------------------------------------------------------------------------
  // VARIABILI PER INFORMAZIONI UTENTE
  // Queste variabili memorizzano le informazioni personali dell'utente.
  // -----------------------------------------------------------------------------------
  protected fullName: string = "";
  protected birthday: string = "";
  protected joined: string = "";
  protected email: string = "";
  protected daysAgo: number = 0;
  protected notifiche: NotificaResponse[] = [];
  protected maniUtente: getAllManiResponse[] = [];
  protected wonHands: number = 0;
  protected lostHands: number = 0;
  protected sessionPlayed: number = 0;
  // -----------------------------------------------------------------------------------
  // COSTRUTTORE
  // Il costruttore inietta i servizi necessari per il funzionamento del componente.
  // -----------------------------------------------------------------------------------
  constructor(private notificheService: NotificheService,
    private userService: UserService,
    private toastr: ToastrService,
    private manoService: ManoService,
    private chartService: ChartService) {
    this.initializeUserInfo();
  }
  // -----------------------------------------------------------------------------------
  // METODI ngOnInit E ngAfterViewInit
  // Questi metodi vengono eseguiti non appena il componente viene visualizzato e dopo che la vista è stata inizializzata.
  // -----------------------------------------------------------------------------------
  ngOnInit(): void {
    console.log('PersonalInfoComponent initialized');
    this.loadNotifiche();
    this.loadUserData(parseInt(localStorage.getItem('id') || '0'));
    this.loadAllManiByUserId(parseInt(localStorage.getItem('id') || '0'));
  }

  ngAfterViewInit(): void {
  }
  // -----------------------------------------------------------------------------------
  // METODO PER CARICARE I DATI DELL'UTENTE
  // Carica i dati dell'utente dal servizio UserService.
  // -----------------------------------------------------------------------------------
  loadUserData(id: number): void {
    this.userService.getUserDataById(id).subscribe({
      next: (response: GetUserDataResponse) => {
        this.saldo = response.saldo;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error while fetching user data: ', error);
        this.toastr.error('Error while fetching user data');
      }
    });
  }
  // -----------------------------------------------------------------------------------
  // METODO PER CONTARE LE MANI VINTE
  // Conta il numero di mani vinte dall'utente.
  // -----------------------------------------------------------------------------------
  countWonHands(): void {
    this.wonHands = this.maniUtente.filter((mano) => mano.importo < 0).length;
  }
  // -----------------------------------------------------------------------------------
  // METODO PER CONTARE LE SESSIONI GIOCATE
  // Conta il numero di sessioni di gioco dell'utente.
  // -----------------------------------------------------------------------------------
  countSessionPlayed(): void {
    if (!this.maniUtente || this.maniUtente.length === 0) {
      console.log("No games played.");
      return;
    }
    // Assicurati che le mani siano ordinate per data
    this.maniUtente.sort((a, b) => new Date(a.dataMano).getTime() - new Date(b.dataMano).getTime());

    let sessionCount = 1; // Inizia con una sessione
    let lastSessionTime = new Date(this.maniUtente[0].dataMano).getTime();

    this.maniUtente.forEach(mano => {
      const currentTime = new Date(mano.dataMano).getTime();
      // Se l'intervallo di tempo tra le mani è superiore a 20 minuti, consideralo una nuova sessione
      if (currentTime - lastSessionTime > 600000) { // 1200000 ms = 20 minuti
        sessionCount++;
        lastSessionTime = currentTime;
      }
    });
    this.sessionPlayed = sessionCount;
  }
  // -----------------------------------------------------------------------------------
  // METODO PER CARICARE TUTTE LE MANI DELL'UTENTE
  // Carica tutte le mani giocate dall'utente dal servizio ManoService.
  // -----------------------------------------------------------------------------------
  loadAllManiByUserId(userId: number): void {
    this.manoService.getAllManiByUserId(userId).subscribe({
      next: (response: getAllManiResponse[]) => {
        this.maniUtente = response;
        this.calculateWinLoss();
        this.initializeChart();
      },
      error: (error: HttpErrorResponse) => {
        this.toastr.error('Error while fetching user data');
        console.error('Error while fetching user data: ', error);
      }
    });
  }
  // -----------------------------------------------------------------------------------
  // METODO PER CALCOLARE VITTORIE E SCONFITTE
  // Calcola il numero di mani vinte e perse dall'utente.
  // -----------------------------------------------------------------------------------
  calculateWinLoss(): void {
    this.wonHands = this.maniUtente.filter(mano => mano.importo > 0).length;
    this.lostHands = this.maniUtente.length - this.wonHands;
  }
  // -----------------------------------------------------------------------------------
  // METODO PER INIZIALIZZARE IL GRAFICO
  // Inizializza il grafico delle mani vinte e perse.
  // -----------------------------------------------------------------------------------
  private initializeChart(): void {
    if (this.chartContainer.nativeElement) {
      const data = [
        { label: 'Won Hands', value: this.wonHands },
        { label: 'Lost Hands', value: this.lostHands }
      ];
      this.chartService.createPieChart(this.chartContainer.nativeElement, data);
    }
  }
  // -----------------------------------------------------------------------------------
  // METODI PER INIZIALIZZARE I DATI UTENTE
  // Inizializza le informazioni personali dell'utente.
  // -----------------------------------------------------------------------------------
  private initializeUserInfo(): void {
    this.fullName = this.getFullName();
    this.birthday = this.formatDate(localStorage.getItem('dataNascita'));
    this.email = localStorage.getItem('email') ?? '';
    this.joined = this.formatDate(localStorage.getItem('dataRegistrazione'));
    this.daysAgo = this.calculateDaysAgo(localStorage.getItem('dataRegistrazione'));
  }
  // -----------------------------------------------------------------------------------
  // METODO PER OTTENERE IL NOME COMPLETO
  // Restituisce il nome completo dell'utente combinando nome e cognome.
  // -----------------------------------------------------------------------------------
  private getFullName(): string {
    const nome = localStorage.getItem('nome') ?? '';
    const cognome = localStorage.getItem('cognome') ?? '';
    return `${nome} ${cognome}`;
  }

  // -----------------------------------------------------------------------------------
  // METODO PER CARICARE LE NOTIFICHE
  // Carica le notifiche della ricarica del saldo dell'utente dal servizio NotificheService.
  // -----------------------------------------------------------------------------------
  loadNotifiche(): void {
    console.log('Caricamento notifiche');
    this.notificheService.getAllByUserId().subscribe({
      next: (response: NotificaResponse[]) => {
        response.forEach((notifica: NotificaResponse) => {
          this.notifiche.push({ data: new Date(notifica.data), messaggio: notifica.messaggio });
        });
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    });
  }
  // -----------------------------------------------------------------------------------
  // METODO PER FORMATTARE LA DATA
  // Converte una stringa di data in un formato leggibile.
  // -----------------------------------------------------------------------------------
  private formatDate(dateString: string | null): string {
    if (!dateString) return 'Data non disponibile';
    const date = new Date(dateString);
    return date.toLocaleDateString("it-IT", {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }
  // -----------------------------------------------------------------------------------
  // METODO PER CALCOLARE I GIORNI TRASCORSI
  // Calcola il numero di giorni trascorsi da una data specifica ad oggi.
  // -----------------------------------------------------------------------------------
  private calculateDaysAgo(dateString: string | null): number {
    if (!dateString) return 0;
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
