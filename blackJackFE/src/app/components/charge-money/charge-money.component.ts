import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, Subscription } from 'rxjs';
import { GetAllTabacchiResponse } from 'src/app/dto/response/GetAllTabacchiResponse';
import { MessageResponse } from 'src/app/dto/response/MessageResponse';
import { MapService } from 'src/app/services/map.service';
import { TabacchiService } from 'src/app/services/tabacchi.service';
// -----------------------------------------------------------------------------------
// COMPONENTE PER LA RICARICA DI DENARO
// Questo componente gestisce la ricarica di denaro tramite i tabacchi selezionati sulla mappa.
// Implementa OnInit e AfterViewInit, interfacce che espongono metodi eseguiti all'inizializzazione del componente e dopo che la vista è stata inizializzata.
// -----------------------------------------------------------------------------------
@Component({
  selector: 'app-charge-money',
  templateUrl: './charge-money.component.html',
  styleUrls: ['./charge-money.component.css']
})
export class ChargeMoneyComponent implements OnInit, AfterViewInit {

  // -----------------------------------------------------------------------------------
  // VARIABILI PER NOMINATIM
  // Queste variabili memorizzano i risultati della ricerca tramite il servizio Nominatim.
  // -----------------------------------------------------------------------------------
  public searchResults: any[] = [];
  // -----------------------------------------------------------------------------------
  // VARIABILI PER LA MAPPA
  // Queste variabili memorizzano l'istanza della mappa e i tabacchi caricati.
  // -----------------------------------------------------------------------------------
  private mapRicaricaDenaro: any;
  protected tabacchi: GetAllTabacchiResponse[] = [];
  // -----------------------------------------------------------------------------------
  // VARIABILI PER IL TABACCHI SELEZIONATO
  // Queste variabili memorizzano il nome del tabacchi selezionato.
  // -----------------------------------------------------------------------------------
  protected tabacchiSelezionatoNome: string = '';
  // -----------------------------------------------------------------------------------
  // VARIABILI PER LE COORDINATE DEL MARKER SELEZIONATO
  // Queste variabili memorizzano le coordinate del marker selezionato.
  // -----------------------------------------------------------------------------------
  protected latMarkerSelezionato: number = this.mapService.latMarkerSelezionato;
  protected lngMarkerSelezionato: number = this.mapService.lngMarkerSelezionato;

  // -----------------------------------------------------------------------------------
  // VARIABILE PER LA RICARICA DENARO
  // Questa variabile memorizza l'importo della ricarica.
  // -----------------------------------------------------------------------------------
  protected importo: number = 0;
  private tabacchiSub!: Subscription;  // Subscription to handle observable

  // -----------------------------------------------------------------------------------
  // COSTRUTTORE
  // Il costruttore inietta i servizi necessari per la gestione della mappa e dei tabacchi.
  // -----------------------------------------------------------------------------------
  constructor(private mapService: MapService, private tabacchiService: TabacchiService, private toastr: ToastrService) {
  }

  // -----------------------------------------------------------------------------------
  // METODI ngOnInit E ngAfterViewInit
  // Questi metodi vengono eseguiti non appena il componente viene visualizzato e dopo che la vista è stata inizializzata.
  // -----------------------------------------------------------------------------------
  ngAfterViewInit() {
    this.mapRicaricaDenaro = this.mapService.initMap(this.mapRicaricaDenaro);
  }

  ngOnInit(): void {
    this.tabacchiSub = this.mapService.selectedTabacchi$.subscribe(tabacchi => {
      this.tabacchiSelezionatoNome = tabacchi ? tabacchi.nomeTabacchi : '';
      // Additional actions if needed when a tabacchi is selected
    });

    this.tabacchiService.getAllTabacchi().subscribe({
      next: (response: GetAllTabacchiResponse[]) => {
        this.tabacchi = response;
        this.mapService.placeTabacchiMarkersChargeMoney(response, this.mapRicaricaDenaro);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error while fetching tabacchi: ', error);
        this.toastr.error('Error while fetching Tabacchi');
      }
    });
  }

  // -----------------------------------------------------------------------------------
  // NOMINATIM SECTION
  // Questi metodi gestiscono la ricerca e la centratura della mappa sui risultati tramite il servizio Nominatim.
  // -----------------------------------------------------------------------------------
  searchNominatim(query: string) {
    if (query.length < 3) {
      this.searchResults = [];
      return;
    }
    //LASCIA COSì il debounce Fidati
    this.mapService.searchNominatimLocation(query).pipe(debounceTime(5000)).subscribe({
      next: (results) => {
        this.searchResults = results;
      },
      error: (error) => {
        console.error('Errore nella ricerca:', error);
        this.searchResults = [];
      }
    });
  }

  centerMapOnResult(result: any): void {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);
    this.mapRicaricaDenaro.flyTo([lat, lon], 15);
  }

  // -----------------------------------------------------------------------------------
  // METODI PER MANDARE LA RICHIESTA DI RICARICA DENARO
  // Questi metodi gestiscono l'invio delle richieste di ricarica denaro.
  // -----------------------------------------------------------------------------------
  mandaRichiestaRicaricaDenaro() {
    this.mapService.richiediRicaricaDenaro(this.importo).subscribe({
      next: (response: MessageResponse) => {
        console.log(response);
        this.toastr.success('Request sent', 'Success');
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error while fetching users: ', error);
        this.toastr.error('Error while fetching users');
      }
    });

  }
}

// ngOnInit(): void {
//   console.log('ChargeMoneyComponent');
//   this.tabacchiService.getAllTabacchi().subscribe({
//     next: (response: GetAllTabacchiResponse[]) => {
//       console.log(response);
//       this.tabacchi = response;
//       this.mapService.placeTabacchiMarkersChargeMoney(response, this.mapRicaricaDenaro);
//     },
//     error: (error: HttpErrorResponse) => {
//       console.error('Error while fetching tabacchi: ', error);
//       this.toastr.error('Error while fetching Tabacchi');
//     }
//   });
// }


// METODI CHE DATA UNA LATITUDINE E LONGITUDINE, RITORNA IL NOME E L'ID DEL TABACCHI --------------------------------
// findTabacchiByCoordinates(lat: number, lng: number): GetAllTabacchiResponse {
//   console.log(`Cerco tabacchi con lat: ${lat} e lng: ${lng}`);
//   const foundTabacchi = this.tabacchi.find(tabacchi =>
//     tabacchi.lat == lat && tabacchi.lng == lng
//   );

//   if (foundTabacchi) {
//     this.tabacchiIdSelezionato = foundTabacchi.tabacchiId;
//     this.tabacchiNomeSelezionato = foundTabacchi.nomeTabacchi;
//     console.log(`Trovato tabacchi: ${foundTabacchi.nomeTabacchi} con ID: ${foundTabacchi.tabacchiId}`);
//     return foundTabacchi;
//   } else {
//     console.log('Nessun tabacchi trovato con queste coordinate.');
//     this.toastr.error('Nessun tabacchi trovato con queste coordinate.');
//     return {} as GetAllTabacchiResponse;
//   }
// }