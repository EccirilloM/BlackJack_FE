import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { GetUserDataResponse } from 'src/app/dto/response/GetUserDataResponse';
import { HttpErrorResponse } from '@angular/common/http';
import { RegistrazioneRequest } from 'src/app/dto/request/RegistrazioneRequest';
import { MessageResponse } from 'src/app/dto/response/MessageResponse';
import { MapService } from 'src/app/services/map.service';
import { debounceTime } from 'rxjs';
import { TabacchiService } from 'src/app/services/tabacchi.service';
import { GetAllTabacchiResponse } from 'src/app/dto/response/GetAllTabacchiResponse';
import { getAllManiResponse } from 'src/app/dto/response/GetAllManiResponse';
import { ManoService } from 'src/app/services/mano.service';
import { ChartService } from 'src/app/services/chart.service';
// -----------------------------------------------------------------------------------
// COMPONENTE PER LA DASHBOARD DELL'ADMIN
// Questo componente gestisce la visualizzazione e la gestione della dashboard dell'admin.
// Implementa OnInit e AfterViewInit, interfacce che espongono metodi eseguiti all'inizializzazione del componente e dopo che la vista è stata inizializzata.
// -----------------------------------------------------------------------------------
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
  // -----------------------------------------------------------------------------------
  // VARIABILI PER I GRAFICI
  // Queste variabili memorizzano i riferimenti ai contenitori dei grafici.
  // -----------------------------------------------------------------------------------
  @ViewChild('usersChart', { static: true }) private usersChartContainer!: ElementRef;
  @ViewChild('commercesChart', { static: true }) private commercesChartContainer!: ElementRef;
  // -----------------------------------------------------------------------------------
  // VARIABILI DATI ADMIN
  // Queste variabili memorizzano i dati relativi agli utenti, economi, tabacchi e mani.
  // -----------------------------------------------------------------------------------
  protected numberOfUsers: number = 0;
  protected utenti: GetUserDataResponse[] = [];
  public searchResults: any[] = [];
  private mapCreaTabacchi: any;
  protected saldoString: string = localStorage.getItem('saldo') || '0';
  protected saldo: number = parseFloat(this.saldoString);
  // -----------------------------------------------------------------------------------
  // VARIABILI PER CREARE ECONOMO O MODIFICARE DATI DI UN USER
  // Queste variabili vengono utilizzate per memorizzare i dati relativi agli economi e agli utenti.
  // -----------------------------------------------------------------------------------
  protected nome = '';
  protected cognome = '';
  protected email = '';
  protected username = '';
  protected password = '';
  protected passwordRipetuta = '';
  protected dataNascita = new Date();
  protected showPassword = false;
  protected showRepeatPassword = false;
  protected economi: GetUserDataResponse[] = [];
  protected currentUser!: GetUserDataResponse;
  // -----------------------------------------------------------------------------------
  // VARIABILI PER TABACCHI
  // Queste variabili vengono utilizzate per memorizzare i dati relativi ai tabacchi.
  // -----------------------------------------------------------------------------------
  protected tabacchi: GetAllTabacchiResponse[] = [];
  protected nomeTabacchi: string = '';
  protected economoSelezionatoId: number = 0;
  protected showEditDataUserByAdmin: boolean = false
  protected idSelected: number = 0;
  // -----------------------------------------------------------------------------------
  // VARIABILI PER LE MANI
  // Queste variabili vengono utilizzate per memorizzare i dati relativi alle mani giocate dagli utenti.
  // -----------------------------------------------------------------------------------
  protected mani: getAllManiResponse[] = [];
  // -----------------------------------------------------------------------------------
  // COSTRUTTORE
  // Il costruttore inietta i servizi necessari per la gestione degli utenti, delle mappe, dei tabacchi e dei grafici.
  // -----------------------------------------------------------------------------------
  constructor(private userService: UserService,
    private toastr: ToastrService,
    private mapService: MapService,
    private tabacchiService: TabacchiService,
    private manoService: ManoService,
    private chartService: ChartService) {
  }
  // -----------------------------------------------------------------------------------
  // METODI ngOnInit E ngAfterViewInit
  // Questi metodi vengono eseguiti non appena il componente viene visualizzato e dopo che la vista è stata inizializzata.
  // -----------------------------------------------------------------------------------
  ngOnInit(): void {
    console.log('Admin Dashboard initialized');
    this.loadUsers();
    this.loadAllEconomi();
    this.loadAllTabacchi();
    this.loadAllMani();  // Carica i dati e inizializza i grafici dopo il caricamento
  }

  ngAfterViewInit(): void {
    this.mapCreaTabacchi = this.mapService.initMapCreaTabacchi(this.mapCreaTabacchi);
    this.initializeCharts();
  }
  // -----------------------------------------------------------------------------------
  // METODI PER PRENDERE LA LATITUDINE E LONGITUDINE DEL MARKER
  // Questi metodi restituiscono le coordinate del marker selezionato sulla mappa.
  // -----------------------------------------------------------------------------------
  latMarker(): number {
    return this.mapService.lat;
  }

  lngMarker(): number {
    return this.mapService.lng;
  }
  // -----------------------------------------------------------------------------------
  // METODI PER MODIFICARE I DATI DI UN UTENTE
  // Questi metodi gestiscono la modifica dei dati di un utente da parte dell'admin.
  // -----------------------------------------------------------------------------------
  adminEditUserData() {
    this.userService.adminAggiornaDatiUtente(this.idSelected, this.nome, this.cognome, this.email, this.username)
      .subscribe({
        next: (res: GetUserDataResponse) => {
          this.toastr.success("Success updating user data");
          this.showEditDataUserByAdmin = false;
        },
        error: (err: HttpErrorResponse) => {
          this.toastr.error(err.error.message);
        }
      });
  }

  toggleModalEditUserData(id: number) {
    this.showEditDataUserByAdmin = !this.showEditDataUserByAdmin;
    this.idSelected = id;
  }
  // -----------------------------------------------------------------------------------
  // NOMINATIM SECTION
  // Questi metodi gestiscono la ricerca di località tramite il servizio Nominatim.
  // -----------------------------------------------------------------------------------
  searchNominatim(query: string) {
    if (query.length < 3) {
      this.searchResults = [];
      return;
    }
    //LASCIA COSì il debounce Fidati
    this.mapService.searchNominatimLocation(query).pipe(debounceTime(5000)).subscribe({
      next: (results) => {
        this.searchResults = results;
      },
      error: (error) => {
        console.error('Errore nella ricerca:', error);
        this.searchResults = [];
      }
    });
  }

  centerMapOnResult(result: any): void {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);
    this.mapCreaTabacchi.flyTo([lat, lon], 15);
  }
  // -----------------------------------------------------------------------------------
  // METODO PER CREARE ECONOMO
  // Questo metodo gestisce la creazione di un nuovo economo.
  // -----------------------------------------------------------------------------------
  creaEconomo(): void {
    // Validazione semplice. Potresti voler aggiungere validazioni più specifiche
    if (!this.nome || !this.cognome || !this.email || !this.username || !this.password || !this.passwordRipetuta || !this.dataNascita) {
      this.toastr.error("Compilale all fields");
      return;
    }

    if (this.password !== this.passwordRipetuta) {
      this.toastr.error("Passwords don't match");
      return;
    }

    const request: RegistrazioneRequest = {
      nome: this.nome,
      cognome: this.cognome,
      email: this.email,
      username: this.username,
      password: this.password,
      dataNascita: new Date(this.dataNascita)
    };

    this.userService.creaEconomo(request).subscribe({
      next: (res: MessageResponse) => {
        this.toastr.success(res.message);
        this.nome = '';
        this.cognome = '';
        this.email = '';
        this.username = '';
        this.password = '';
        this.passwordRipetuta = '';
        this.dataNascita = new Date();
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.toastr.error(err.error.message || 'Error while creating economo');
      }
    });
  }
  // -----------------------------------------------------------------------------------
  // METODO PER CREARE TABACCHI
  // Questo metodo gestisce la creazione di nuovi tabacchi.
  // -----------------------------------------------------------------------------------
  creaTabacchi(): void {
    this.tabacchiService.creaTabacchi(this.nomeTabacchi, this.latMarker(), this.lngMarker(), this.economoSelezionatoId).subscribe({
      next: (res: MessageResponse) => {
        this.toastr.success(res.message);
        this.nomeTabacchi = '';
        this.tabacchi.push({ nomeTabacchi: this.nomeTabacchi, lat: this.latMarker(), lng: this.lngMarker(), userId: this.economoSelezionatoId, tabacchiId: 0 });
        this.mapService.placeTabacchiMarkers(this.tabacchi, this.mapCreaTabacchi);
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.toastr.error(err.error.message || 'Error while creating tabacchi');
      }
    });
  }
  // -----------------------------------------------------------------------------------
  // METODO PER CARICARE GLI UTENTI
  // Questo metodo gestisce il caricamento degli utenti.
  // -----------------------------------------------------------------------------------
  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (response: GetUserDataResponse[]) => {
        console.log(response);
        this.utenti = response;
        this.numberOfUsers = this.utenti.length;
      },
      error: (error: HttpErrorResponse) => {
        this.toastr.error('Error while fetching users');
      }
    });
  }

  // -----------------------------------------------------------------------------------
  // METODO PER CARICARE TUTTI GLI ECONOMI
  // Questo metodo gestisce il caricamento di tutti gli economi.
  // -----------------------------------------------------------------------------------
  loadAllEconomi(): void {
    this.userService.getAllByRuolo('ECONOMO').subscribe({
      next: (response: GetUserDataResponse[]) => {
        this.economi = response;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error while fetching Economi: ', error);
        this.toastr.error('Error while fetching Economi');
      }
    });

  }

  // -----------------------------------------------------------------------------------
  // METODO PER CARICARE TUTTI I TABACCHI
  // Questo metodo gestisce il caricamento di tutti i tabacchi.
  // -----------------------------------------------------------------------------------
  loadAllTabacchi(): void {
    this.tabacchiService.getAllTabacchi().subscribe({
      next: (response: GetAllTabacchiResponse[]) => {
        console.log(response);
        this.tabacchi = response;
        this.mapService.placeTabacchiMarkers(response, this.mapCreaTabacchi);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error while fetching tabacchi: ', error);
        this.toastr.error(error.error.message);
      }
    });
  }

  // -----------------------------------------------------------------------------------
  // METODO PER ELIMINARE UN UTENTE
  // Questo metodo gestisce l'eliminazione degli utenti.
  // -----------------------------------------------------------------------------------
  deleteUser(userId: number): void {
    console.log('Eliminazione utente con id: ', userId);
    this.userService.deleteUser(userId).subscribe({
      next: (response: MessageResponse) => {
        console.log(response);
        this.loadUsers();
        this.toastr.success("User deleted successfully");
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error while deleting user: ', error);
        this.toastr.error(error.error.message);
      }
    });
  }

  // -----------------------------------------------------------------------------------
  // METODO PER CARICARE LE MANI
  // Questo metodo gestisce il caricamento delle mani.
  // -----------------------------------------------------------------------------------
  loadAllMani(): void {
    this.manoService.getAllMani().subscribe({
      next: (response: getAllManiResponse[]) => {
        this.mani = response;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error while fetching hands: ', error);
        this.toastr.error('Error while fetching hands');
      }
    });
  }
  // -----------------------------------------------------------------------------------
  // METODO PER INIZIALIZZARE I GRAFICI
  // Questo metodo gestisce l'inizializzazione dei grafici.
  // -----------------------------------------------------------------------------------
  private initializeCharts(): void {
    // Assicurati che il contenitore sia disponibile e visibile
    if (this.usersChartContainer.nativeElement && this.commercesChartContainer.nativeElement) {
      setTimeout(() => {
        this.chartService.createPieChart(this.usersChartContainer.nativeElement, this.calculateWinLossData());
        this.chartService.createPieChart(this.commercesChartContainer.nativeElement, this.calculateSessionDurationData());
      }, 500); // Potrebbe essere necessario un ritardo per assicurare che il DOM sia pronto
    }
  }
  // -----------------------------------------------------------------------------------
  // METODI PER CALCOLARE I DATI DEI GRAFICI
  // Questi metodi calcolano i dati necessari per i grafici.
  // -----------------------------------------------------------------------------------
  /**
   * Calcola i dati delle vincite e delle perdite per il grafico a torta.
   * @returns Un array di oggetti contenenti le etichette e i valori delle vincite e delle perdite.
   */
  private calculateWinLossData(): { label: string; value: number }[] {

    console.log('All Hands:', this.mani);
    const winningsData = this.mani.filter(m => m.importo > 0);
    const lossesData = this.mani.filter(m => m.importo < 0);

    console.log('Winnings Data:', winningsData);
    console.log('Losses Data:', lossesData);

    const winningsCount = winningsData.length;
    const lossesCount = lossesData.length;

    return [
      { label: 'Casino Wins', value: Math.round(winningsCount) },
      { label: 'Casino Losses', value: Math.round(lossesCount) }
    ];
  }
  /**
   * Calcola i dati della durata delle sessioni per il grafico a torta.
   * @returns Un array di oggetti contenenti le etichette e i valori delle sessioni.
   */
  private calculateSessionDurationData(): { label: string; value: number }[] {
    let sessionsOver10Minutes = 0;
    let totalSessions = 0;
    const handsByUser = this.groupAndSortHandsByUser();

    Object.values(handsByUser).forEach(hands => {
      let sessionStart = hands[0];
      totalSessions++;
      for (let i = 1; i < hands.length; i++) {
        const timeDiff = (new Date(hands[i].dataMano).getTime() - new Date(sessionStart.dataMano).getTime()) / 60000;
        if (timeDiff > 10) {
          sessionsOver10Minutes++;
          sessionStart = hands[i]; // Start a new session
          totalSessions++;
        }
      }
    });

    return [
      { label: 'Sessions Over 10 Minutes', value: sessionsOver10Minutes },
      { label: 'Other Sessions', value: totalSessions - sessionsOver10Minutes }
    ];
  }
  /**
   * Calcola i dati della durata delle sessioni per il grafico a torta.
   * @returns Un array di oggetti contenenti le etichette e i valori delle sessioni.
   */
  private groupAndSortHandsByUser(): { [username: string]: getAllManiResponse[] } {
    return this.mani.reduce((acc, curr) => {
      acc[curr.playerUsername] = acc[curr.playerUsername] || [];
      acc[curr.playerUsername].push(curr);
      return acc;
    }, {} as { [username: string]: getAllManiResponse[] });
  }
}
