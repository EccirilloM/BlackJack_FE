import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { globalBackendUrl } from 'environment';
import { NotificaResponse } from '../dto/response/NotificaResponse';
import { Observable } from 'rxjs';
// -----------------------------------------------------------------------------------
// Servizio per gestire le interazioni con il backend riguardo alle notifiche.
// -----------------------------------------------------------------------------------
@Injectable({
  providedIn: 'root'
})
export class NotificheService {

  private backendUrl: string = globalBackendUrl + 'notifica/';

  /**
   * Costruttore dove vengono iniettate le dipendenze necessarie.
   * @param http Istanza di HttpClient per effettuare le chiamate HTTP.
   */
  constructor(private http: HttpClient) { }

  /**
   * Metodo per ottenere tutte le notifiche di un utente per ID.
   * @returns Observable contenente la lista di tutte le notifiche dell'utente.
   */
  getAllByUserId(): Observable<NotificaResponse[]> {
    const header = this.getHeader();
    return this.http.get<NotificaResponse[]>(this.backendUrl + 'getAllNotificheByUserId/' + localStorage?.getItem('id'), { headers: header });
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
