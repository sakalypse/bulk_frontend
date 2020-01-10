import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
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
  API_URL = environment.API_URL_DEV;
  sessionId;
  userId;
  players;
  owner;
  session;

  constructor(
    @Inject(AuthService)
    public authService: AuthService,
    public toastr: ToastrService,
    public handler: HttpBackend, 
    public http: HttpClient,
    public route: Router,
    public socket:Socket,
    activateRoute:ActivatedRoute) {
    this.http = new HttpClient(handler);
    activateRoute.params.subscribe(val => {
      this.init();
    });
  }
  async ngOnInit(){}
  async init() {
    //todo check if user has a current session
    //else redirect to home
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + this.authService.getToken()
      })
    };
    if(this.authService.hasToken()&&
      !this.authService.hasTokenExpired()){
      this.userId =  this.authService.getLoggedUser().userid;
    }
    else{
      this.userId = JSON.parse(localStorage.getItem('userIdGuest'));
    }

    await this.http.get<any>(`${this.API_URL}/user/${this.userId}`, httpOptions)
    .toPromise().then(result=>{
      if(result.session!=null)
        this.sessionId = result.session.sessionId;
      else  
        this.sessionId = result.sessionHost.sessionId;
    })
    if(this.sessionId==null)
      this.route.navigate(['home']);
    


    //fetch session to know who is owner
    await this.http.get<any>(`${this.API_URL}/session/${this.sessionId}`, httpOptions)
    .toPromise().then(
      result => {
        this.sessionId = result.sessionId;
        this.players = result.players;
        this.session = result;
        if(result.owner.userId==this.userId)
          this.owner=true;
        else
          this.owner=false;
    });


    //initialize socket
    this.socket.emit('joinSession', this.userId, this.sessionId);

    //listen for new player
    this.socket.fromEvent('joinSession').
    subscribe(async id => {
      await this.http.get<any>(`${this.API_URL}/user/${id}`, httpOptions)
      .subscribe(player=>{
        if(player.userId!=this.session.owner.userId)
          this.players.push(player);
      })
    });

    //listen for player quitting
    this.socket.fromEvent('quitSession').
    subscribe(async id => {
      this.players = this.players.
                        filter(x => x.userId !== id);
    });

    //listen for session killed
    this.socket.fromEvent('killSession').
    subscribe(async id => {
      this.route.navigate(['home']);
    });

    //listen for game started
    this.socket.fromEvent('joinGame').
    subscribe(async id => {
      this.route.navigate(["game"]);
    });
  }

  ready(){
    if(this.players.length<2){
      console.log("ne pas lancé si < 3");
    }
    else{
      
    }
    this.socket.emit('joinGame', this.sessionId);
    this.toastr.success('Game started', 'Game');
    this.route.navigate(["/host"]);
  }

  quit(){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };
    this.http.
    put<any>(`${this.API_URL}/session/removeuser/${this.sessionId}`,
    {userId:this.userId},
    httpOptions).
    subscribe(
      result => {
        this.socket.emit('quitSession', this.userId, this.sessionId);
        this.socket.removeAllListeners();
      },
      error => {
        this.toastr.error(error, 'Quit session error');
      },
      () => {
        this.toastr.success('Session successfully quitted', 'Session');
        this.route.navigate(["home"]);
      }
    );
  }

  delete(){
    this.http.delete<any>(`${this.API_URL}/session/delete/${this.sessionId}`).
    subscribe(
      result => {
        this.socket.emit('killSession', this.sessionId);
        this.socket.removeAllListeners();
      },
      error => {
        this.toastr.error(error, 'Quit session error');
      },
      () => {
        this.toastr.success('Session successfully quitted', 'Session');
        this.route.navigate(["home"]);
      }
    );
  }
}
