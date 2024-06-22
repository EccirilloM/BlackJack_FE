import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { globalBackendUrl } from 'environment';
import { MessageResponse } from '../dto/response/MessageResponse';
import { Observable } from 'rxjs';
import { GetAllRichiestaRicaricaSaldoResponse } from '../dto/response/GetAllRichiestaRicaricaSaldoResponse';
import { AccettaRichiestaRequest } from '../dto/request/AccettaRichiestaRequest';
// -----------------------------------------------------------------------------------
// Servizio per gestire le interazioni con il backend riguardo alle richieste di ricarica.
// -----------------------------------------------------------------------------------
@Injectable({
  providedIn: 'root'
})
export class RicaricaService {

  private backendUrl: string = globalBackendUrl + 'ricarica/';

  /**
   * Costruttore dove vengono iniettate le dipendenze necessarie.
   * @param http Istanza di HttpClient per effettuare le chiamate HTTP.
   */
  constructor(private http: HttpClient) { }

  /**
   * Metodo per ottenere tutte le richieste di ricarica per un economo.
   * @returns Observable contenente la lista di tutte le richieste di ricarica.
   */
  getAllRichiesteByEconomo(): Observable<GetAllRichiestaRicaricaSaldoResponse[]> {
    return this.http.get<GetAllRichiestaRicaricaSaldoResponse[]>(this.backendUrl + 'getAllRichiesteByEconomo/' + localStorage.getItem('id'), { headers: this.getHeader() });
  }

  /**
   * Metodo per accettare una richiesta di ricarica.
   * @param richiestaId ID della richiesta di ricarica.
   * @param playerId ID del giocatore.
   * @returns Observable contenente la risposta del server.
   */
  accettaRichiesta(richiestaId: number, playerId: number): Observable<MessageResponse> {
    const request: AccettaRichiestaRequest = { richiestaId, playerId };
    return this.http.put<MessageResponse>(this.backendUrl + 'accettaRichiesta', request, { headers: this.getHeader() });
  }

  /**
   * Metodo per rifiutare una richiesta di ricarica.
   * @param richiestaId ID della richiesta di ricarica.
   * @returns Observable contenente la risposta del server.
   */
  rifiutaRichiesta(richiestaId: number): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>(this.backendUrl + 'rifiutaRichiesta/' + richiestaId.toString(), { headers: this.getHeader() });
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

