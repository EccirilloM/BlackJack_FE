import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http"
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as L from 'leaflet';
import { GetAllTabacchiResponse } from '../dto/response/GetAllTabacchiResponse';
import { globalBackendUrl } from 'environment';
import { MessageResponse } from '../dto/response/MessageResponse';
import { ToastrService } from 'ngx-toastr';
import { RicaricaSaldoRequest } from '../dto/request/RicaricaSaldoRequest';
//configurazione dell'immagine del marker
const iconUrl = 'assets/marker/marker-icon.png';
const iconDefault = L.icon({
  iconUrl,
  iconSize: [25, 36],
  iconAnchor: [12, 41],
  shadowUrl: '',
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = iconDefault;
// -----------------------------------------------------------------------------------
// Servizio per gestire le mappe e le interazioni con il backend riguardanti i tabacchi.
// -----------------------------------------------------------------------------------
@Injectable({
  providedIn: 'root'
})
export class MapService {
  private backendUrl: string = globalBackendUrl + 'tabacchi/';

  // -----------------------------------------------------------------------------------
  // STATO DEL TABACCHI SELEZIONATO
  // Variabile per il controllo dello stato del tabacchi selezionato.
  // -----------------------------------------------------------------------------------
  private selectedTabacchiSource = new BehaviorSubject<GetAllTabacchiResponse | null>(null);
  selectedTabacchi$ = this.selectedTabacchiSource.asObservable();

  // -----------------------------------------------------------------------------------
  // VARIABILI PER IL TABACCHI CORRENTE
  // Queste variabili memorizzano le coordinate del marker selezionato.
  // -----------------------------------------------------------------------------------
  latMarkerSelezionato: number = 0;
  lngMarkerSelezionato: number = 0;

  // -----------------------------------------------------------------------------------
  // VARIABILI PER LE MAPPE
  // Queste variabili memorizzano le istanze delle mappe utilizzate nel servizio.
  // -----------------------------------------------------------------------------------
  private mapCreaTabacchi: any;
  private mapRicaricaDenaro: any;

  // -----------------------------------------------------------------------------------
  // VARIABILI PER LE COORDINATE DEI TABACCHI
  // Queste variabili memorizzano le coordinate geografiche deo tabacchi.
  // -----------------------------------------------------------------------------------
  public lat: number = 0;
  public lng: number = 0;
  tabacchi: GetAllTabacchiResponse[] = [];

  // -----------------------------------------------------------------------------------
  // VARIABILI PER IL TABACCHI SELEZIONATO
  // Queste variabili memorizzano i dettagli del tabacchi selezionato.
  // -----------------------------------------------------------------------------------
  public tabacchiNomeSelezionato!: string;
  public tabacchiIdSelezionato!: number;
  public foundTabacchi!: GetAllTabacchiResponse | undefined;

  /**
 * Costruttore dove vengono iniettate le dipendenze necessarie.
 * @param http Istanza di HttpClient per effettuare le chiamate HTTP.
 * @param toastr Istanza di ToastrService per visualizzare notifiche.
 */
  constructor(private http: HttpClient, private toastr: ToastrService) { }

  /**
   * Metodo per eliminare il tabacchi selezionato.
   * @param tabacchiId ID del tabacchi da eliminare.
   * @returns Observable con la risposta del server.
   */
  eliminaTabacchiById(tabacchiId: string): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>(this.backendUrl + 'eliminaTabacchi/' + tabacchiId, { headers: this.getHeader() });
  }

  /**
   * Inizializza la mappa per ricaricare denaro.
   * @param mapRicaricaDenaro Riferimento alla mappa da inizializzare.
   * @returns La mappa inizializzata.
   */
  initMap(mapRicaricaDenaro: any): any {
    mapRicaricaDenaro = L.map('mapRicaricaDenaro', {
      center: [41.9027835, 12.4963655],
      zoom: 10
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(mapRicaricaDenaro);

    this.mapRicaricaDenaro = mapRicaricaDenaro;
    return mapRicaricaDenaro;
  }

  /**
   * Inizializza la mappa per creare tabacchi.
   * @param mapCreaTabacchi Riferimento alla mappa da inizializzare.
   * @returns La mappa inizializzata.
   */
  initMapCreaTabacchi(mapCreaTabacchi: any): any {
    mapCreaTabacchi = L.map('mapCreaTabacchi', {
      center: [41.9027835, 12.4963655],
      zoom: 10
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(mapCreaTabacchi);

    mapCreaTabacchi.eachLayer((layer: any) => {
      if (layer instanceof L.Marker) {
        mapCreaTabacchi.removeLayer(layer);
      }

    });
    mapCreaTabacchi.on('click', (e: any) => {
      this.lat = e.latlng.lat;
      this.lng = e.latlng.lng;

      L.marker([this.lat, this.lng]).addTo(mapCreaTabacchi);
    });

    mapCreaTabacchi.on('popupopen', (e: any) => {
      this.handleEliminaTabacchi(e);

    });

    this.mapCreaTabacchi = mapCreaTabacchi;
    return mapCreaTabacchi;
  }

  /**
   * Posiziona i marker dei tabacchi sulla mappa per ricaricare denaro.
   * @param tabacchi Lista di tabacchi da visualizzare sulla mappa.
   * @param mapRicaricaDenaro Riferimento alla mappa.
   */
  placeTabacchiMarkersChargeMoney(tabacchi: GetAllTabacchiResponse[], mapRicaricaDenaro: any): void {
    // Clears existing markers
    mapRicaricaDenaro.eachLayer((layer: any) => {
      if (layer instanceof L.Marker) {
        mapRicaricaDenaro.removeLayer(layer);
      }
    });

    // Add new markers
    tabacchi.forEach((tabacchi: GetAllTabacchiResponse) => {
      let marker = L.marker([tabacchi.lat, tabacchi.lng])
        .addTo(mapRicaricaDenaro)
        .bindPopup(`<p>${tabacchi.nomeTabacchi}</p>`);

      marker.on('click', () => {
        this.selectedTabacchiSource.next(tabacchi);  // Update the BehaviorSubject
        this.toastr.info(`Tabacchi ${tabacchi.nomeTabacchi} selected`);
      });
    });
  }

  /**
   * Trova il tabacchi in base alle coordinate.
   * @param lat Latitudine.
   * @param lng Longitudine.
   */
  findTabacchiByCoordinates(lat: number, lng: number): void {
    console.log(`Cerco tabacchi con lat: ${lat} e lng: ${lng}`);
    this.foundTabacchi = this.tabacchi.find(tabacchi =>
      tabacchi.lat == lat && tabacchi.lng == lng
    );

    if (this.foundTabacchi) {
      this.tabacchiIdSelezionato = this.foundTabacchi.tabacchiId;
      this.tabacchiNomeSelezionato = this.foundTabacchi.nomeTabacchi;
      console.log(`Trovato tabacchi: ${this.foundTabacchi.nomeTabacchi} con ID: ${this.foundTabacchi.tabacchiId}`);
    } else {
      console.log('Nessun tabacchi trovato con queste coordinate.');
      this.toastr.error('Tabacchi not found with these coordinates.');
    }
  }

  /**
   * Richiede la ricarica del denaro.
   * @param importo Importo da ricaricare.
   * @returns Observable con la risposta del server.
   */
  richiediRicaricaDenaro(importo: number): Observable<MessageResponse> {
    if (importo <= 0) {
      this.toastr.error('Insert a valid amount!');
    }
    const tabacchiId = this.selectedTabacchiSource.value?.tabacchiId;
    if (tabacchiId === undefined) {
      this.toastr.error('No tabacchi selected!');
      throw new Error('No Tabacchi Selected'); // Lancia un errore o gestisci come preferisci
    }

    const request: RicaricaSaldoRequest = { tabacchiId, importo };
    return this.http.post<MessageResponse>('http://localhost:8080/api/v1/ricarica/richiediRicarica/' + localStorage.getItem("id"), request, { headers: this.getHeader() });
  }

  /**
   * Posiziona i marker dei tabacchi sulla mappa per creare tabacchi.
   * @param tabacchi Lista di tabacchi da visualizzare sulla mappa.
   * @param mapCreaTabacchi Riferimento alla mappa.
   */
  placeTabacchiMarkers(tabacchi: GetAllTabacchiResponse[], mapCreaTabacchi: any): void {
    mapCreaTabacchi.eachLayer((layer: any) => {
      if (layer instanceof L.Marker) {
        mapCreaTabacchi.removeLayer(layer);
      }

    });

    this.tabacchi = tabacchi;
    // Aggiungi un popup al marker con un pulsante
    tabacchi.forEach((tabacchi: GetAllTabacchiResponse) => {
      let popupContent: string = `
      <p>${tabacchi.nomeTabacchi}</p>
      <button id="elimina-tabacchi" name="${tabacchi.tabacchiId}" class="p-2.5 text-sm font-medium text-black rounded-lg border border-3 border-red-800">
        Elimina Tabacchi #${tabacchi.tabacchiId}
      </button>
    `;
      L.marker([tabacchi.lat, tabacchi.lng]).addTo(mapCreaTabacchi).bindPopup(popupContent);
    });
    this.mapCreaTabacchi = mapCreaTabacchi;
  }

  /**
   * Mostra il nome del tabacchi selezionato.
   * @param e Evento.
   */
  handleMostraNome(e: any): void {
    const button = document.getElementById('nome-tabacchi');
    if (button) {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        if (e.target) {
          const target = e.target as HTMLButtonElement;
          console.log(target.name);
        }
      });
    }
  }

  /**
   * Gestisce l'eliminazione del tabacchi selezionato lato frontend.
   * @param e Evento.
   */
  handleEliminaTabacchi(e: any): void {
    const button = document.getElementById('elimina-tabacchi');
    if (button) {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        if (e.target) {
          const target = e.target as HTMLButtonElement;
          this.eliminaTabacchiById(target.name.toString()).subscribe({
            next: (response: MessageResponse) => {
              this.toastr.success("Tabacchi deleted successfully!");
              this.tabacchi = this.tabacchi.filter((tabacchi: GetAllTabacchiResponse) => tabacchi.tabacchiId.toString() !== target.name);
              this.placeTabacchiMarkers(this.tabacchi, this.mapCreaTabacchi);
            }, error: (error: HttpErrorResponse) => {
              console.error('Error while deleting tabacchi: ', error);
              this.toastr.error(error.error.message);
            }
          });
        }
      });
    }
  }

  private nominatimUrl = 'https://nominatim.openstreetmap.org';

  /**
   * Cerca una posizione utilizzando Nominatim.
   * @param query Query di ricerca.
   * @returns Observable con i risultati della ricerca.
   */
  searchNominatimLocation(query: string): Observable<any> {
    const url = `${this.nominatimUrl}/search?format=json&q=${encodeURIComponent(query)}`;
    return this.http.get<any>(url).pipe(
      catchError(error => {
        console.error('Errore nella richiesta a Nominatim:', error);
        throw error;
      })
    );
  }

  /**
   * Crea l'header con il token da mandare al backend.
   * @returns HttpHeaders con il token e le informazioni dell'utente.
   */
  private getHeader(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': localStorage.getItem('token') ? `${localStorage.getItem('token')}` : '',
      id: localStorage.getItem('id') ? `${localStorage.getItem('id')}` : '',
      ruolo: localStorage.getItem('ruolo') ? `${localStorage.getItem('ruolo')}` : ''
    });
  }
}
