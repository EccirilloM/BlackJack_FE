import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { globalBackendUrl } from 'environment';
import { MessageResponse } from '../dto/response/MessageResponse';
import { TavoloStatusResponse } from '../dto/response/TavoloStatusResponse';
// -----------------------------------------------------------------------------------
// Servizio per gestire le interazioni con il backend riguardo ai tavoli.
// -----------------------------------------------------------------------------------
@Injectable({
  providedIn: 'root'
})
export class TablesService {
  private backendUrl: string = globalBackendUrl + 'tavolo/';

  /**
   * Costruttore dove vengono iniettate le dipendenze necessarie.
   * @param http Istanza di HttpClient per effettuare le chiamate HTTP.
   */
  constructor(private http: HttpClient) { }

  /**
   * Metodo per inizializzare un tavolo.
   * @param tipoTavolo Tipo del tavolo da inizializzare.
   * @returns Observable contenente la risposta del server.
   */
  initTavolo(tipoTavolo: string): Observable<MessageResponse> {
    return this.http.get<MessageResponse>(this.backendUrl + "init/" + tipoTavolo + "/" + localStorage.getItem('id')?.toString(), { headers: this.getHeader() });
  }

  /**
   * Metodo per terminare un tavolo.
   * @returns Observable contenente la risposta del server.
   */
  end(): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.backendUrl}end/` + localStorage.getItem('id')?.toString(), {});
  }

  /**
   * Metodo per ottenere tutte le azioni di comando disponibili.
   * @returns Observable contenente una lista di stringhe con i nomi dei comandi.
   */
  getAllCommandActions(): Observable<string[]> {
    return this.http.get<string[]>(`${this.backendUrl}getCommandsAvaliable`, { headers: this.getHeader() });
  }

  /**
   * Metodo per eseguire una specifica azione di comando.
   * @param command Il comando da eseguire.
   * @param data I dati da inviare insieme al comando.
   * @returns Observable contenente lo stato del tavolo dopo l'esecuzione del comando.
   */
  executeCommandAction(command: string, data: any): Observable<TavoloStatusResponse> {
    const userId = localStorage.getItem('id');
    const url = `${this.backendUrl}${command}/${userId}`;
    console.log("Sending to backend:", JSON.stringify(data));
    return this.http.post<TavoloStatusResponse>(url, JSON.stringify(data), { headers: this.getHeader() });
  }

  /**
   * Crea l'header con il token da mandare al backend.
   * @returns HttpHeaders con il token e le informazioni dell'utente.
   */
  private getHeader(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json', // Assicurati che sia impostato
      'Authorization': localStorage.getItem('token') ? `${localStorage.getItem('token')}` : '',
      id: localStorage.getItem('id') ? `${localStorage.getItem('id')}` : '',
      ruolo: localStorage.getItem('ruolo') ? `${localStorage.getItem('ruolo')}` : ''
    });
  }
}
