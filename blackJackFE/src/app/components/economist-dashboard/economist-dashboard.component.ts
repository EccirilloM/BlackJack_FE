import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { GetAllRichiestaRicaricaSaldoResponse } from 'src/app/dto/response/GetAllRichiestaRicaricaSaldoResponse';
import { MessageResponse } from 'src/app/dto/response/MessageResponse';
import { RicaricaService } from 'src/app/services/ricarica.service';
import { ToastrService } from 'ngx-toastr';

// -----------------------------------------------------------------------------------
// COMPONENTE DASHBOARD DELL'ECONOMO
// Questo componente gestisce la dashboard dell'economo, visualizzando e gestendo le richieste di ricarica saldo.
// Implementa OnInit, un'interfaccia che espone un metodo che viene eseguito non appena il componente viene visualizzato.
// -----------------------------------------------------------------------------------
@Component({
  selector: 'app-economist-dashboard',
  templateUrl: './economist-dashboard.component.html',
  styleUrls: ['./economist-dashboard.component.css']
})
export class EconomistDashboardComponent implements OnInit {
  // -----------------------------------------------------------------------------------
  // VARIABILI PER LE RICHIESTE DI RICARICA E IL NOME DELL'ECONOMISTA
  // Queste variabili memorizzano le richieste di ricarica e il nome dell'economista.
  // -----------------------------------------------------------------------------------
  protected richieste: GetAllRichiestaRicaricaSaldoResponse[] = [];
  protected nomeEconomo: string = localStorage.getItem('nome') || '';

  // -----------------------------------------------------------------------------------
  // COSTRUTTORE
  // Il costruttore inietta i servizi necessari per la gestione delle richieste di ricarica e la visualizzazione di messaggi.
  // -----------------------------------------------------------------------------------
  constructor(private ricaricaService: RicaricaService, private toastr: ToastrService) { }

  // -----------------------------------------------------------------------------------
  // METODO ngOnInit
  // Questo metodo viene eseguito non appena il componente viene visualizzato.
  // -----------------------------------------------------------------------------------
  ngOnInit(): void {
    console.log('EconomistDashboardComponent');
    this.loadRichieste();
  }

  // -----------------------------------------------------------------------------------
  // METODO PER CARICARE LE RICHIESTE DI RICARICA SALDO
  // Questo metodo gestiscoe il caricamento delle richieste di ricarica saldo.
  // -----------------------------------------------------------------------------------
  loadRichieste(): void {
    console.log('Carico le richieste');
    this.ricaricaService.getAllRichiesteByEconomo().subscribe({
      next: (response: GetAllRichiestaRicaricaSaldoResponse[]) => {
        console.log(response);
        this.richieste = response;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error while fetching richieste: ', error);
      }
    });
  }

  // -----------------------------------------------------------------------------------
  // METODO PER ACCETTARE LE RICHIESTE DI RICARICA SALDO
  // Questo metodo gestisce l'accettazione delle richieste di ricarica saldo.
  // -----------------------------------------------------------------------------------
  accettaRichiesta(richiesta: GetAllRichiestaRicaricaSaldoResponse): void {
    console.log('Accetto richiesta: ');
    console.log(richiesta);
    this.ricaricaService.accettaRichiesta(richiesta.richiestaId, richiesta.playerId).subscribe({
      next: (response: MessageResponse) => {
        console.log(response);
        this.loadRichieste();
        this.toastr.success('Request accepted', 'Success');
      },
      error: (error: HttpErrorResponse) => {
        this.toastr.error('Error while the request', 'Error');
      }
    });
  }

  // -----------------------------------------------------------------------------------
  // METODO PER RIFIUTARE LE RICHIESTE DI RICARICA SALDO
  // Questo metodo gestisce il rifiuto delle richieste di ricarica saldo.
  // -----------------------------------------------------------------------------------
  rifiutaRichiesta(richiesta: GetAllRichiestaRicaricaSaldoResponse): void {
    console.log('Rifiuto richiesta: ');
    console.log(richiesta);
    this.ricaricaService.rifiutaRichiesta(richiesta.richiestaId).subscribe({
      next: (response: MessageResponse) => {
        console.log(response);
        this.loadRichieste();
        this.toastr.success('Request denied', 'Success');
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error while refusing richiesta: ', error);
        this.toastr.error('Error while refusing request', 'Error');
      }
    });
  }
}
