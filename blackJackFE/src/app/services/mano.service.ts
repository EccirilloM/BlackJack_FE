import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { globalBackendUrl } from 'environment';
import { getAllManiResponse } from '../dto/response/GetAllManiResponse';
import { Observable } from 'rxjs';
// -----------------------------------------------------------------------------------
// Servizio per gestire le interazioni con il backend riguardo alle mani.
// -----------------------------------------------------------------------------------
@Injectable({
  providedIn: 'root'
})
export class ManoService {

  private backendUrl: string = globalBackendUrl + 'mano/';

  // COSTRUTTORE --------------------------------------------------------------------------------------------------------
  /**
   * Costruttore dove vengono iniettate le dipendenze necessarie.
   * @param http Istanza di HttpClient per effettuare le chiamate HTTP.
   */
  constructor(private http: HttpClient) { }

  // METODI PUBBLICI -----------------------------------------------------------------------------------------------------
  /**
   * Metodo per richiedere tutte le mani.
   * @returns Observable contenente la lista di tutte le mani.
   */
  getAllMani(): Observable<getAllManiResponse[]> {
    return this.http.get<getAllManiResponse[]>(this.backendUrl + 'getAllMani', { headers: this.getHeader() });
  }

  /**
   * Metodo per richiedere tutte le mani di un utente specifico.
   * @param userId ID dell'utente di cui richiedere le mani.
   * @returns Observable contenente la lista di tutte le mani dell'utente specificato.
   */
  getAllManiByUserId(userId: number): Observable<getAllManiResponse[]> {
    return this.http.get<getAllManiResponse[]>(this.backendUrl + 'getAllManiByUserId/' + userId, { headers: this.getHeader() });
  }

  // METODI PER RECUPERARE I DATI DELL'UTENTE LOGGATO ---------------------------------------------------------------
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
