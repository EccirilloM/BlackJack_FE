import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginRequest } from '../dto/request/LoginRequest';
import { RegistrazioneRequest } from '../dto/request/RegistrazioneRequest';
import { LoginResponse } from '../dto/response/LoginResponse';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MessageResponse } from '../dto/response/MessageResponse';
import { globalBackendUrl } from 'environment';
// -----------------------------------------------------------------------------------
// Servizio per gestire le operazioni di autenticazione.
// -----------------------------------------------------------------------------------
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private backendUrl: string = globalBackendUrl + 'auth/';

  // -----------------------------------------------------------------------------------
  // STATO DI AUTENTICAZIONE
  // Variabile per il controllo dello stato dell'utente loggato.
  // -----------------------------------------------------------------------------------
  private isAuthenticatedSource = new BehaviorSubject<boolean>(this.checkIsAuthenticatedInitial());
  isAuthenticated$ = this.isAuthenticatedSource.asObservable();

  /**
   * Costruttore del servizio di autenticazione.
   * @param http Il servizio HttpClient per le richieste HTTP.
   * @param router Il servizio Router per la navigazione tra le pagine.
   * @param toastr Il servizio Toastr per mostrare notifiche all'utente.
   */
  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) { }

  /**
   * Controlla se l'utente è autenticato all'inizio.
   * @returns true se l'utente è autenticato, altrimenti false.
   */
  private checkIsAuthenticatedInitial(): boolean {
    const token = localStorage.getItem('token');
    return !!token; // Restituisce true se il token esiste, altrimenti false
  }

  /**
   * Usato per accedere allo stato corrente in un modo reattivo.
   * @returns Un Observable dello stato di autenticazione.
   */
  checkIsAuthenticated(): Observable<boolean> {
    return this.isAuthenticated$;
  }

  /**
   * Imposta lo stato di autenticazione.
   * @param value Il nuovo stato di autenticazione.
   */
  setIsAuthenticated(value: boolean) {
    this.isAuthenticatedSource.next(value);
  }

  /**
   * Esegue il login dell'utente.
   * @param request I dati di login.
   * @returns Un Observable con la risposta di login.
   */
  login(request: LoginRequest): Observable<LoginResponse> {
    this.setIsAuthenticated(true);
    return this.http.post<LoginResponse>(this.backendUrl + 'login', request);
  }

  /**
   * Esegue la registrazione di un nuovo utente.
   * @param request I dati di registrazione.
   * @returns Un Observable con la risposta del server.
   */
  registrazione(request: RegistrazioneRequest): Observable<MessageResponse> {
    console.log(request);
    return this.http.post<MessageResponse>(this.backendUrl + 'registrazionePlayer', request);
  }

  /**
   * Esegue il logout dell'utente.
   */
  logout(): void {
    this.router.navigateByUrl('/login');
    localStorage.clear();
    this.toastr.success("Logout successful");
    this.setIsAuthenticated(false);
  }

  /**
   * Recupera gli header HTTP con il token di autenticazione.
   * @returns Gli HttpHeaders con il token di autenticazione.
   */
  getHttpHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  /**
   * Recupera il token di autenticazione dal localStorage.
   * @returns Il token di autenticazione.
   */
  getToken(): string {
    return localStorage.getItem('token') ?? '';
  }

  /**
   * Recupera il ruolo dell'utente dal localStorage.
   * @returns Il ruolo dell'utente.
   */
  getRole(): string {
    return localStorage.getItem('ruolo') ?? '';
  }
}
