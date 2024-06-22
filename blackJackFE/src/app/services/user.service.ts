import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UpdateUserDataRequest } from '../dto/request/UpdateUserDataRequest';
import { GetUserDataResponse } from '../dto/response/GetUserDataResponse';
import { globalBackendUrl } from 'environment';
import { Observable } from 'rxjs';
import { MessageResponse } from '../dto/response/MessageResponse';
import { RegistrazioneRequest } from '../dto/request/RegistrazioneRequest';
import { AdminUpdateUserDataRequest } from '../dto/request/AdminUpdateUserData';
// -----------------------------------------------------------------------------------
// Servizio per gestire le interazioni con il backend riguardo agli utenti.
// -----------------------------------------------------------------------------------
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private backendUrl: string = globalBackendUrl + 'user/';
  // COSTRUTTORE --------------------------------------------------------------------------------------------------------
  /**
   * Costruttore dove vengono iniettate le dipendenze necessarie.
   * @param http Istanza di HttpClient per effettuare le chiamate HTTP.
   */
  constructor(private http: HttpClient) { }

  // CHIAMATE AL BACKEND PER L'UTENTE -----------------------------------------------------------------------------------

  /**
   * Metodo per aggiornare i dati dell'utente.
   * @param nome Nome dell'utente
   * @param cognome Cognome dell'utente
   * @param email Email dell'utente
   * @param username Username dell'utente
   * @param vecchiaPassword Vecchia password dell'utente
   * @param nuovaPassword Nuova password dell'utente
   * @returns Observable contenente i dati aggiornati dell'utente
   */
  aggiornaDatiUtente(nome: string, cognome: string, email: string, username: string, vecchiaPassword: string, nuovaPassword: string): Observable<GetUserDataResponse> {
    const header = this.getHeader();
    const request: UpdateUserDataRequest = { nome, cognome, email, username, vecchiaPassword, nuovaPassword };

    return this.http.put<GetUserDataResponse>(this.backendUrl + 'aggiornaDatiUtente/' + localStorage.getItem('id')?.toString(), request, { headers: header });
  }

  /**
   * Metodo per l'amministratore per aggiornare i dati di un utente.
   * @param id ID dell'utente
   * @param nome Nome dell'utente
   * @param cognome Cognome dell'utente
   * @param email Email dell'utente
   * @param username Username dell'utente
   * @returns Observable contenente i dati aggiornati dell'utente
   */
  adminAggiornaDatiUtente(id: number, nome: string, cognome: string, email: string, username: string): Observable<GetUserDataResponse> {
    const header = this.getHeader();
    const request: AdminUpdateUserDataRequest = { nome, cognome, email, username };

    return this.http.put<GetUserDataResponse>(this.backendUrl + 'adminAggiornaDatiUtente/' + id.toString(), request, { headers: header });
  }

  /**
   * Metodo per richiedere tutti gli utenti dell'applicazione.
   * @returns Observable contenente la lista degli utenti
   */
  getAllUsers(): Observable<GetUserDataResponse[]> {
    const header = this.getHeader();
    return this.http.get<GetUserDataResponse[]>(this.backendUrl + 'getAllUsers', { headers: header });
  }

  /**
   * Metodo per richiedere tutti gli utenti con un determinato ruolo.
   * @param ruolo Ruolo degli utenti da cercare
   * @returns Observable contenente la lista degli utenti con il ruolo specificato
   */
  getAllByRuolo(ruolo: string): Observable<GetUserDataResponse[]> {
    const header = this.getHeader();
    return this.http.get<GetUserDataResponse[]>(this.backendUrl + 'getAllByRuolo/' + ruolo, { headers: header });
  }

  /**
   * Metodo per ottenere i dati di un utente per ID.
   * @param id ID dell'utente
   * @returns Observable contenente i dati dell'utente
   */
  getUserDataById(id: number): Observable<GetUserDataResponse> {
    const header = this.getHeader();
    return this.http.get<GetUserDataResponse>(this.backendUrl + 'getUserDataById/' + id, { headers: header });
  }

  /**
   * Metodo per creare un economo.
   * @param request Richiesta di registrazione contenente i dati dell'economo
   * @returns Observable contenente la risposta del server
   */
  creaEconomo(request: RegistrazioneRequest): Observable<MessageResponse> {
    const header = this.getHeader();
    return this.http.post<MessageResponse>(this.backendUrl + 'creaEconomo', request, { headers: header });
  }

  /**
   * Metodo per creare un utente.
   * @param request Richiesta di registrazione contenente i dati dell'utente
   * @returns Observable contenente la risposta del server
   */
  creaUtente(request: RegistrazioneRequest): Observable<MessageResponse> {
    const header = this.getHeader();
    return this.http.post<MessageResponse>(this.backendUrl + 'creaUtente', request, { headers: header });
  }

  /**
   * Metodo per eliminare un utente per ID.
   * @param userId ID dell'utente da eliminare
   * @returns Observable contenente la risposta del server
   */
  deleteUser(userId: number): Observable<MessageResponse> {
    const header = this.getHeader();
    return this.http.delete<MessageResponse>(this.backendUrl + 'delete/' + userId, { headers: header });
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

