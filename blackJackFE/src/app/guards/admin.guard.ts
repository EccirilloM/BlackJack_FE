import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service'; // Assicurati che il percorso sia corretto
import { Ruolo } from '../types/ruolo';

/**
 * Guard per proteggere le route che richiedono l'accesso come amministratore.
 */
@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {

  // COSTRUTTORE --------------------------------------------------------------------------------------------------------
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService // Aggiungi ToastrService
  ) { }

  // METODO PER CONTROLLARE L'ACCESSO ALLA ROUTE ------------------------------------------------------------------------
  /**
   * Controlla se l'utente può attivare la route protetta come amministratore.
   * @param route La route attuale.
   * @param state Lo stato del router.
   * @returns true se l'utente è autenticato e ha il ruolo di amministratore, altrimenti false.
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Verifica se l'utente è autenticato e ha il ruolo di amministratore.
    const isAuthenticated = this.authService.checkIsAuthenticated();
    const isAdmin = this.authService.getRole() === Ruolo.ADMIN;

    // Se l'utente non è autenticato o non è amministratore, mostra un errore e reindirizza.
    if (!isAuthenticated || !isAdmin) {
      this.toastr.error('Access Denied, You must be an Admin to access this page');
      this.router.navigate(['/homepage']);
      return false;
    }
    return true;
  }
}
