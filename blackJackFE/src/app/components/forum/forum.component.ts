import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetAllMessagesByTipoTavoloResponse } from 'src/app/dto/response/GetAllMessagesByTipoTavoloResponse';
import { MessageResponse } from 'src/app/dto/response/MessageResponse';
import { ForumService } from 'src/app/services/forum.service';
import { Tavolo } from 'src/app/types/tavolo';
import { ToastrService } from 'ngx-toastr';
// -----------------------------------------------------------------------------------
// COMPONENTE FORUM
// Questo componente gestisce la visualizzazione e l'interazione con il forum dei tavoli.
// Implementa OnInit, un'interfaccia che espone un metodo che viene eseguito non appena il componente viene visualizzato.
// -----------------------------------------------------------------------------------
@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit {
  // -----------------------------------------------------------------------------------
  // VARIABILI PER I MESSAGGI
  // Queste variabili memorizzano il tipo di tavolo e i messaggi del forum.
  // -----------------------------------------------------------------------------------
  protected tipoTavolo: Tavolo | null = null;
  protected messaggi: GetAllMessagesByTipoTavoloResponse[] = [];
  protected testoMessaggio: string = '';


  // -----------------------------------------------------------------------------------
  // COSTRUTTORE
  // Il costruttore inietta i servizi necessari per la gestione del forum e la navigazione.
  // -----------------------------------------------------------------------------------
  constructor(
    private forumService: ForumService,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) { }

  // -----------------------------------------------------------------------------------
  // METODO ngOnInit
  // Questo metodo viene eseguito non appena il componente viene visualizzato.
  // -----------------------------------------------------------------------------------
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.tipoTavolo = params['tipoTavolo'];
      this.loadMessages();
    });
    // this.loadMessages();
  }

  // -----------------------------------------------------------------------------------
  // METODI PER I TAVOLI
  // Questi metodi gestiscono la visualizzazione delle immagini dei tavoli.
  // -----------------------------------------------------------------------------------
  getTavoloImage(tipoTavolo: Tavolo | null): string {
    if (!tipoTavolo) return ''; // o un percorso di immagine predefinito
    return `assets/tables/tavolo${tipoTavolo}.png`;
  }

  // -----------------------------------------------------------------------------------
  // METODO PER INVIARE I MESSAGGI I MESSAGGI
  // Questo metodo gestisce l'invio dei messaggi del forum.
  // -----------------------------------------------------------------------------------
  inviaMessaggio(): void {
    console.log('Scrivi messaggio');
    this.forumService.inviaMessaggio(this.tipoTavolo?.toString(), this.testoMessaggio).subscribe({
      next: (response: MessageResponse) => {
        console.log(response);
        this.loadMessages();
        this.testoMessaggio = '';
        this.toastr.success('Messagge sent', 'Success');
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error while sending message: ', error);
        this.toastr.error('Error while sending message', 'Error');
      }
    });
  }

  // -----------------------------------------------------------------------------------
  // METODO PER CARICARE I MESSAGGI
  // Questo metodo gestisce il caricamento dei messaggi del forum.
  // -----------------------------------------------------------------------------------
  loadMessages(): void {
    console.log('Carico i messaggi del table');
    this.forumService.getAllMessagesByTipoTavolo(this.tipoTavolo?.toString()).subscribe({
      next: (response: GetAllMessagesByTipoTavoloResponse[]) => {
        console.log(response);
        this.messaggi = response;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error while fetching messages: ', error);
        this.toastr.error('Error while fetching messages', 'Error');
      }
    });
  }
}

