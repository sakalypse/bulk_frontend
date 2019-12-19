import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse, HttpBackend, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-pre-game',
  templateUrl: './pre-game.page.html',
  styleUrls: ['./pre-game.page.scss'],
})
export class PreGamePage implements OnInit {
  private API_URL = environment.API_URL_DEV;
  private sessionId;
  private players;

  constructor(
    @Inject(AuthService)
    private authService: AuthService,
    private toastr: ToastrService,
    private handler: HttpBackend, 
    private http: HttpClient,
    private route: Router,
    private socket:Socket) {
    this.http = new HttpClient(handler);
  }

  async ngOnInit() {
    //todo check if user has a current session
    //else redirect to home
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + this.authService.getToken()
      })
    };
    let userid;
    if(this.authService.hasToken()&&
      !this.authService.hasTokenExpired()){
      userid =  this.authService.getLoggedUser().userid;
    }
    else{
      userid = JSON.parse(localStorage.getItem('userIdGuest'));
    }

    await this.http.get<any>(`${this.API_URL}/user/${userid}`, httpOptions)
    .toPromise().then(result=>{
      this.sessionId = result.session.sessionId;
    })

    //fetch session to know who is owner
    await this.http.get<any>(`${this.API_URL}/session/${this.sessionId}`, httpOptions)
    .toPromise().then(
      result => {
        this.sessionId = result.sessionId;
        this.players = result.players;
    });


    //initialize socket
    this.socket.emit('joinSession', userid, this.sessionId);

    //listen for new player
    this.socket.fromEvent('joinSession').
    subscribe((username: string) => {
      let player={
        username:username
      }
      this.players.push(player);
    });
  }

  quit(){
    this.http.delete<any>(`${this.API_URL}/session/delete/${this.sessionId}`).
    subscribe(
      result => {
        this.socket.emit('sessionKilled', this.sessionId);
      },
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
