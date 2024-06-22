import { Injectable } from '@angular/core';
import { globalBackendUrl } from 'environment';
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { CreaTabacchiRequest } from '../dto/request/CreaTabacchiRequest';
import { Observable } from 'rxjs';
import { MessageResponse } from '../dto/response/MessageResponse';
import { GetAllTabacchiResponse } from '../dto/response/GetAllTabacchiResponse';
// -----------------------------------------------------------------------------------
// Servizio per gestire le interazioni con il backend riguardo ai tabacchi.
// -----------------------------------------------------------------------------------
@Injectable({
  providedIn: 'root'
})
export class TabacchiService {
  private backendUrl: string = globalBackendUrl + 'tabacchi/';

  /**
   * Costruttore dove vengono iniettate le dipendenze necessarie.
   * @param http Istanza di HttpClient per effettuare le chiamate HTTP.
   */
  constructor(private http: HttpClient) { }

  /**
   * Metodo per creare un tabacchi.
   * @param nomeTabacchi Nome del tabacchi
   * @param lat Latitudine del tabacchi
   * @param lng Longitudine del tabacchi
   * @param economoId ID dell'economo
   * @returns Observable contenente la risposta del server
   */
  creaTabacchi(nomeTabacchi: string, lat: number, lng: number, economoId: number): Observable<MessageResponse> {
    const request: CreaTabacchiRequest = { nomeTabacchi, lat, lng, economoId };
    return this.http.post<MessageResponse>(this.backendUrl + 'creaTabacchi', request, { headers: this.getHeader() });
  }

  /**
   * Metodo per richiedere tutti i tabacchi.
   * @returns Observable contenente la lista di tutti i tabacchi
   */
  getAllTabacchi(): Observable<GetAllTabacchiResponse[]> {
    return this.http.get<GetAllTabacchiResponse[]>(this.backendUrl + 'getAllTabacchi', { headers: this.getHeader() });
  }

  /**
   * Crea l'header con il token da mandare al backend.
   * @returns HttpHeaders con il token e le informazioni dell'utente
   */
  private getHeader(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': localStorage.getItem('token') ? `${localStorage.getItem('token')}` : '',
      id: localStorage.getItem('id') ? `${localStorage.getItem('id')}` : '',
      ruolo: localStorage.getItem('ruolo') ? `${localStorage.getItem('ruolo')}` : ''
    });
  }
}
