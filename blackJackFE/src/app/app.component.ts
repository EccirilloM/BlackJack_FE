import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'blackJackFE';

  constructor(public authService: AuthService, public router: Router) {

  }

  ngOnInit(): void {
    console.log("BEGIN OF THE APP")
    // this.authService.logout();
    // window.addEventListener('beforeunload', (event) => {
    //   this.authService.logout();
    // });
  }

}
