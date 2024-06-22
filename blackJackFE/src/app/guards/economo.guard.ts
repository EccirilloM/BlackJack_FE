import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Ruolo } from '../types/ruolo';

/**
 * Guard per proteggere le route che richiedono il ruolo di economo.
 */
@Injectable({
  providedIn: 'root'
})
export class EconomoGuard implements CanActivate {

  // COSTRUTTORE --------------------------------------------------------------------------------------------------------
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  // METODO PER CONTROLLARE L'ACCESSO ALLA ROUTE ------------------------------------------------------------------------
  /**
   * Controlla se l'utente può attivare la route protetta.
   * @param route La route attuale.
   * @param state Lo stato del router.
   * @returns true se l'utente è un economo autenticato, altrimenti false.
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const isAuthenticated = this.authService.checkIsAuthenticated();
    const ruolo = this.authService.getRole();

    // Se l'utente non è autenticato o non ha il ruolo di economo, mostra un errore e reindirizza.
    if (!isAuthenticated || ruolo !== Ruolo.ECONOMO) {
      this.toastr.error('Access Denied. You must be an economo to access this page.');
      this.router.navigate(['/homepage']);
      return false;
    }
    return true;
  }
}
