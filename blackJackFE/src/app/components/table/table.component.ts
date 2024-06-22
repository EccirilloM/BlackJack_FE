import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CartaResponse } from 'src/app/dto/response/CartaResponse';
import { MessageResponse } from 'src/app/dto/response/MessageResponse';
import { TavoloStatusResponse } from 'src/app/dto/response/TavoloStatusResponse';
import { TablesService } from 'src/app/services/tables.service';
import { UserService } from 'src/app/services/user.service';
import { Tavolo } from 'src/app/types/tavolo';
import { Wager } from 'src/app/types/wager';
// -----------------------------------------------------------------------------------
// COMPONENTE DI GESTIONE DEL TAVOLO DA GIOCO
// Questo componente gestisce il tavolo da gioco e le sue interazioni.
// Implementa OnInit, un'interfaccia che espone un metodo che viene eseguito non appena il componente viene visualizzato.
// -----------------------------------------------------------------------------------
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  // -----------------------------------------------------------------------------------
  // VARIABILI DELL'UTENTE
  // Queste variabili vengono utilizzate per memorizzare le informazioni dell'utente.
  // -----------------------------------------------------------------------------------
  protected playerUsername: string = localStorage.getItem('username') || '';
  protected wager: number = 0;
  protected playerCash: number = 0;
  protected playerWinning: number = 0;
  protected cartePlayer: CartaResponse[] = [];
  protected scorePlayer: number = 0;
  protected puntataPlayer: number = 0;
  protected puntataMinima: number = 0;
  // -----------------------------------------------------------------------------------
  // VARIABILI PER IL TAVOLO
  // Queste variabili gestiscono lo stato e le caratteristiche del tavolo da gioco.
  // -----------------------------------------------------------------------------------
  protected warningMessage: string = '';
  protected tipoTavolo!: Tavolo;
  protected dealAttivo: boolean = true;
  protected tipoTavoloParam: string = '';
  protected availableCommands: string[] = [];
  // -----------------------------------------------------------------------------------
  // VARIABILI PER IL DEALER
  // Queste variabili vengono utilizzate per gestire le carte e il punteggio del dealer.
  // -----------------------------------------------------------------------------------
  protected carteDealer: CartaResponse[] = [];
  protected scoreDealer: number = 0;
  // -----------------------------------------------------------------------------------
  // VARIABILI PER IL CONTEGGIO
  // Queste variabili vengono utilizzate per tenere traccia del conteggio delle carte giocate.
  // -----------------------------------------------------------------------------------
  protected conteggio: number = 0;
  protected carteUnicheGiocate: Set<number> = new Set();
  protected valoreReale: number = 0;
  numeroDiMazzi: number = 6; // Default al valore massimo se non specificato
  protected showDeviazioniClassiche: boolean = false
  // -----------------------------------------------------------------------------------
  // COSTRUTTORE
  // Il costruttore inietta i servizi necessari per il funzionamento del componente.
  // -----------------------------------------------------------------------------------
  constructor(private route: ActivatedRoute,
    private tablesService: TablesService,
    private router: Router,
    private toastr: ToastrService) {
    const saldo = localStorage.getItem('saldo');
    this.playerCash = saldo ? parseFloat(saldo) : 0;
  }

  // -----------------------------------------------------------------------------------
  // METODO ngOnInit
  // Questo metodo viene eseguito non appena il componente viene visualizzato.
  // -----------------------------------------------------------------------------------
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.tipoTavoloParam = params.get('tipoTavolo')?.toString().toUpperCase() || '';
      this.configureTableType(this.tipoTavoloParam);
      this.initTavolo(this.tipoTavoloParam);
      this.loadAvailableCommands();
    });
  }
  // -----------------------------------------------------------------------------------
  // METODO PER CONFIGURARE IL TIPO DI TAVOLO
  // Configura le caratteristiche del tavolo in base al tipo di tavolo selezionato.
  // -----------------------------------------------------------------------------------
  configureTableType(tipoTavoloParam: string): void {
    const puntate = {
      'BASE': { minima: 1, mazzi: 6 },
      'PREMIUM': { minima: 5, mazzi: 4 },
      'VIP': { minima: 10, mazzi: 3 },
      'EXCLUSIVE': { minima: 20, mazzi: 2 }
    };

    const config = puntate[tipoTavoloParam as keyof typeof puntate];
    if (config) {
      this.puntataMinima = config.minima;
      this.numeroDiMazzi = config.mazzi;
      this.wager = this.puntataMinima;
    } else {
      this.toastr.error('Invalid or missing table type', 'Error');
      this.router.navigate(['/homepage/dashboard']);
    }
  }
  // -----------------------------------------------------------------------------------
  // METODO PER CARICARE I COMANDI DISPONIBILI
  // Carica i comandi disponibili per il tavolo da gioco.
  // -----------------------------------------------------------------------------------
  loadAvailableCommands(): void {
    this.tablesService.getAllCommandActions().subscribe({
      next: (commands: string[]) => {
        this.availableCommands = commands;
      },
      error: (error: HttpErrorResponse) => {
        this.toastr.error('Failed to load commands', 'Error');
      }
    });
  }
  // -----------------------------------------------------------------------------------
  // METODO PER GESTIRE IL CLICK SUI COMANDI
  // Gestisce le azioni eseguite quando un comando viene cliccato.
  // -----------------------------------------------------------------------------------
  onCommandClick(command: string): void {
    if (command === 'deal' && this.wager > 0) {
      this.sendCommandToBackend(command, this.wager);
      this.dealAttivo = false; // Disabilita Deal appena viene cliccato
    } else if (command !== 'deal') {
      this.sendCommandToBackend(command, NaN);
      if (!this.dealAttivo) {
        this.dealAttivo = true; // Potrebbe non essere necessario se vuoi che Deal sia disabilitato fino a un nuovo inizio
      }
    } else {
      this.toastr.error('Wager is not set properly', 'Error');
    }
  }
  // -----------------------------------------------------------------------------------
  // METODO PER INVIARE I COMANDI AL BACKEND
  // Invia i comandi al backend per essere eseguiti.
  // -----------------------------------------------------------------------------------
  sendCommandToBackend(command: string, plot: number): void {
    const body: Wager = { plot };
    console.log("Final body to send:", body); // Assicurati che questo mostri { plot: this.wager } correttamente
    this.tablesService.executeCommandAction(command, body).subscribe({
      next: (data) => {
        console.log('Data received:', data);
        this.playerCash = data.saldo;
        this.playerWinning = data.winning;
        this.handleTavoloStatus(data);
        this.updateConteggio([...data.cartePlayer, ...data.carteDealer]);
        this.dealAttivo = data.tavoloStatus === 'PLAYER_WIN' || data.tavoloStatus === 'PLAYER_LOSE' || data.tavoloStatus === 'DRAW' ? true : false;
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error(err.error.message, 'Error');
        this.router.navigate(['/homepage/dashboard']);
      }
    });
  }
  // -----------------------------------------------------------------------------------
  // METODO PER INIZIALIZZARE IL TAVOLO
  // Inizializza lo stato del tavolo da gioco.
  // -----------------------------------------------------------------------------------
  initTavolo(tipoTavolo: string): void {
    this.tablesService.initTavolo(tipoTavolo).subscribe({
      next: (data: MessageResponse) => {
        this.toastr.success(data.message, 'Table initialized');
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error(err.error.message, 'Error');
        this.router.navigate(['/homepage/dashboard']);
      }
    });
  }
  // -----------------------------------------------------------------------------------
  // METODO PER GESTIRE LO STATO DEL TAVOLO
  // Gestisce le modifiche allo stato del tavolo in base alla risposta del backend.
  // -----------------------------------------------------------------------------------
  private handleTavoloStatus(response: TavoloStatusResponse): void {
    this.cartePlayer = response.cartePlayer;
    this.scorePlayer = response.punteggioPlayer;
    this.carteDealer = response.carteDealer;
    this.scoreDealer = response.punteggioDealer;

    switch (response.tavoloStatus) {
      case 'PLAYER_WIN':
        this.warningMessage = 'Hai vinto!';
        this.dealAttivo = true;
        break;
      case 'PLAYER_LOSE':
        this.warningMessage = 'Hai perso!';
        this.dealAttivo = true;
        break;
      case 'DRAW':
        this.warningMessage = 'Pareggio!';
        this.dealAttivo = true;
        break;
      case 'CONTINUE':
        this.warningMessage = '';
        this.dealAttivo = false;
        break;
      default:
        this.toastr.error('Unkown Table Status', 'Errore');
        break;
    }
    console.log("dealAttivo updated to:", this.dealAttivo);
  }
  // -----------------------------------------------------------------------------------
  // METODO PER AGGIORNARE IL CONTEGGIO DELLE CARTE
  // Aggiorna il conteggio delle carte giocate per tenere traccia del gioco.
  // -----------------------------------------------------------------------------------
  updateConteggio(carte: CartaResponse[]): void {
    const totaleCarte = this.numeroDiMazzi * 52;  // Assumendo che ogni mazzo abbia 52 carte

    // Se l'ordine corrente supera il totale delle carte, resettare il conteggio
    const maxOrder = Math.max(...carte.map(carta => carta.order));
    if (maxOrder >= totaleCarte) {
      this.resetConteggio();
    }

    carte.forEach(carta => {
      // Calcola l'indice modificato di 'order' per gestire il riutilizzo del mazzo
      const adjustedOrder = carta.order % totaleCarte;

      // Verifica se la carta è già stata considerata
      if (!this.carteUnicheGiocate.has(adjustedOrder)) {
        this.carteUnicheGiocate.add(adjustedOrder);
        const valore = carta.valore;

        if (['2', '3', '4', '5', '6'].includes(valore)) {
          this.conteggio += 1;
        } else if (['10', 'J', 'Q', 'K', 'A'].includes(valore)) {
          this.conteggio -= 1;
        }
        // Le carte 7, 8, 9 non modificano il conteggio
      }
    });

    this.updateValoreReale();
  }

  // -----------------------------------------------------------------------------------
  // METODO PER RESETTARE IL CONTEGGIO DELLE CARTE
  // Resetta il conteggio delle carte quando il mazzo viene rimescolato.
  // -----------------------------------------------------------------------------------
  private resetConteggio(): void {
    this.carteUnicheGiocate.clear();
    this.conteggio = 0;
    this.valoreReale = 0;
  }
  // -----------------------------------------------------------------------------------
  // METODO PER AGGIORNARE IL VALORE REALE
  // Calcola e aggiorna il valore reale delle carte rimaste nel mazzo.
  // -----------------------------------------------------------------------------------
  private updateValoreReale(): void {
    const mazziRimasti = Math.max(this.numeroDiMazzi - (this.carteUnicheGiocate.size / 52), 0.5);  // Evita la divisione per zero
    this.valoreReale = this.conteggio / mazziRimasti;  // Calcola il valore reale

    this.checkAndUpdateBetRecommendation();
  }
  // -----------------------------------------------------------------------------------
  // METODO PER AGGIORNARE LA RACCOMANDAZIONE DI SCOMMESSA
  // Fornisce raccomandazioni di scommessa in base al valore reale.
  // -----------------------------------------------------------------------------------
  private checkAndUpdateBetRecommendation(): void {
    if (this.valoreReale > 4) {  // Cambio soglia per mostrare il messaggio
      // Traducimi in inglese: "Il Mazzo è carico! Aumenta la punta"

      this.toastr.info('The Deck is hot! Increase your bet!', 'Informazione', {
        timeOut: 3000
      });
    } else if (this.valoreReale < -4) {
      this.toastr.info('The Deck is Cold! Play the minimum', 'Informazione', {
        timeOut: 3000
      });
    }
  }
  // -----------------------------------------------------------------------------------
  // METODO PER TERMINARE LA PARTITA
  // Termina la partita e resetta lo stato del gioco.
  // -----------------------------------------------------------------------------------
  end(): void {
    console.log('Fine della partita');
    this.cartePlayer = [];
    this.scorePlayer = 0;
    this.carteDealer = [];
    this.scorePlayer = 0;

    this.tablesService.end().subscribe({
      next: (data: MessageResponse) => {
        console.log('end', data);
        this.initTavolo(this.tipoTavoloParam);
        this.dealAttivo = true;
        this.updatePlayerCash();
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error(err.error.message, 'Error');
        this.router.navigate(['/homepage/dashboard']);
      }
    });
  }
  // -----------------------------------------------------------------------------------
  // METODO PER AGGIORNARE IL SALDO DELL'UTENTE
  // Aggiorna il saldo dell'utente dopo ogni partita.
  // --------------------------------------------------------------------------------
  updatePlayerCash(): void {
    localStorage.setItem('playerCash', this.playerCash.toString());
  }
  // -----------------------------------------------------------------------------------
  // METODO PER NAVIGARE ALLA HOMEPAGE
  // Naviga alla dashboard della homepage.
  // -----------------------------------------------------------------------------------
  goToHomePage(): void {
    this.router.navigate(['/homepage/dashboard']);
  }

  toggleModalDeviazioniClassiche(): void {
    this.showDeviazioniClassiche = !this.showDeviazioniClassiche;
  }
}
