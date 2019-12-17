import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse, HttpBackend, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pre-game',
  templateUrl: './pre-game.page.html',
  styleUrls: ['./pre-game.page.scss'],
})
export class PreGamePage implements OnInit {
  private API_URL = environment.API_URL_DEV;
  private sessionId;
  constructor(
    @Inject(AuthService)
    private authService: AuthService,
    private toastr: ToastrService,
    private handler: HttpBackend, 
    private http: HttpClient,
    private route: Router) {
    this.http = new HttpClient(handler);
  }

  ngOnInit() {
    //todo check if user has a current session
    //else redirect to home
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + this.authService.getToken()
      })
    };
    const userid =  this.authService.getLoggedUser().userid;
    let user = this.http.get<any>(`${this.API_URL}/user/${userid}`, httpOptions);
    user.subscribe(
      result => {
        this.sessionId = result.session.sessionId;
        console.log('session :'+this.sessionId);

      });
  }

  quit(){
    this.http.delete<any>(`${this.API_URL}/session/delete/${this.sessionId}`).
    subscribe(
      result => {},
      error => {
        this.toastr.error(error, 'Quit session error');
      },
      () => {
        this.toastr.success('Session successfully quitted', 'Session');
        this.route.navigateByUrl("/host");
      }
    );
  }

}
