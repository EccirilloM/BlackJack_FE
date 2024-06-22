import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';

/**
 * Guard per proteggere le route che richiedono autenticazione.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  // COSTRUTTORE --------------------------------------------------------------------------------------------------------
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService // Aggiungi ToastrService
  ) { }

  // METODO PER CONTROLLARE L'ACCESSO ALLA ROUTE ------------------------------------------------------------------------
  /**
   * Controlla se l'utente può attivare la route protetta.
   * @param route La route attuale.
   * @param state Lo stato del router.
   * @returns true se l'utente è autenticato, altrimenti false.
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | boolean {
    return this.authService.checkIsAuthenticated().pipe(
      map(isAuthenticated => {
        // Se l'utente non è autenticato, mostra un errore e reindirizza.
        if (!isAuthenticated) {
          this.toastr.error('You must be authenticated to access this page');
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      })
    );
  }
}

