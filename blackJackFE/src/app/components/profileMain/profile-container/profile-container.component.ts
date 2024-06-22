import { Component, OnInit } from '@angular/core';
// -----------------------------------------------------------------------------------
// COMPONENTE DEL CONTENITORE DEL PROFILO
// Questo componente funge da contenitore principale per le sezioni del profilo utente.
// Implementa OnInit, un'interfaccia che espone un metodo che viene eseguito non appena il componente viene visualizzato.
// -----------------------------------------------------------------------------------
@Component({
  selector: 'app-profile-container',
  templateUrl: './profile-container.component.html',
  styleUrls: ['./profile-container.component.css']
})
export class ProfileContainerComponent implements OnInit {

  // -----------------------------------------------------------------------------------
  // COSTRUTTORE
  // Il costruttore può essere utilizzato per iniettare servizi necessari al componente.
  // -----------------------------------------------------------------------------------
  constructor() {
    // Costruttore vuoto, nessun servizio iniettato
  }

  // -----------------------------------------------------------------------------------
  // METODO ngOnInit
  // Questo metodo viene eseguito non appena il componente viene visualizzato.
  // -----------------------------------------------------------------------------------
  ngOnInit(): void {
    console.log('ProfileContainerComponent');
  }
}
