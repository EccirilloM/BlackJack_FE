import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Tavolo } from '../types/tavolo';
import { GetAllMessagesByTipoTavoloResponse } from '../dto/response/GetAllMessagesByTipoTavoloResponse';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { globalBackendUrl } from 'environment';
import { MessageResponse } from '../dto/response/MessageResponse';
import { InviaMessaggioRequest } from '../dto/request/InviaMessaggioRequest';
// -----------------------------------------------------------------------------------
// Servizio per gestire le interazioni con il backend riguardo ai messaggi nel forum.
// -----------------------------------------------------------------------------------
@Injectable({
  providedIn: 'root'
})
export class ForumService {
  private backendUrl: string = globalBackendUrl + 'messaggio/';

  private currentTavolo = new BehaviorSubject<Tavolo | null>(null);
  // COSTRUTTORE --------------------------------------------------------------------------------------------------------
  /**
   * Costruttore dove vengono iniettate le dipendenze necessarie.
   * @param http Istanza di HttpClient per effettuare le chiamate HTTP.
   */
  constructor(private http: HttpClient) { }

  /**
   * Metodo per aggiornare il tipo di tavolo selezionato.
   * @param tipoTavolo Tipo di tavolo selezionato.
   */
  changeTavolo(tipoTavolo: Tavolo): void {
    this.currentTavolo.next(tipoTavolo);
  }

  /**
   * Metodo per ottenere l'Observable del tipo di tavolo attuale.
   * @returns Observable contenente il tipo di tavolo attuale.
   */
  getCurrentTavolo(): Observable<Tavolo | null> {
    return this.currentTavolo.asObservable();
  }

  /**
   * Metodo per ottenere tutti i messaggi per un determinato tipo di tavolo.
   * @param tipoTavolo Tipo di tavolo per cui recuperare i messaggi.
   * @returns Observable contenente la lista dei messaggi per il tipo di tavolo specificato.
   */
  getAllMessagesByTipoTavolo(tipoTavolo: string | undefined): Observable<GetAllMessagesByTipoTavoloResponse[]> {
    return this.http.get<GetAllMessagesByTipoTavoloResponse[]>(this.backendUrl + 'getAllMessageByTipoTavolo/' + tipoTavolo, { headers: this.getHeader() });
  }

  /**
   * Metodo per inviare un messaggio per un determinato tipo di tavolo.
   * @param tipoTavolo Tipo di tavolo a cui inviare il messaggio.
   * @param testo Testo del messaggio da inviare.
   * @returns Observable contenente la risposta del server.
   */
  inviaMessaggio(tipoTavolo: string | undefined, testo: string): Observable<MessageResponse> {
    const request: InviaMessaggioRequest = { testo: testo, mittenteId: parseInt(localStorage.getItem('id') || '0'), tipoTavolo: tipoTavolo || '' };
    return this.http.post<MessageResponse>(this.backendUrl + 'invia', request, { headers: this.getHeader() });
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

