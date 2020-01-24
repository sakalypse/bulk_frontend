import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { ToastrService } from 'ngx-toastr';
import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

  constructor(@Inject(AuthService)
  public authService: AuthService,
  public toastr: ToastrService,
  public handler: HttpBackend, 
  public http: HttpClient,
  public route: Router,
  public socket:Socket) {
    this.http = new HttpClient(handler);
  }

  API_URL = environment.API_URL_DEV;
  userId;
  sessionId;
  choices;
  choiceBuffer;
  username;
  didWinAPoint;

  score = 0;

  async ngOnInit() {
    this.choices=null;
    this.didWinAPoint=null;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + this.authService.getToken()
      })
    };
    if(this.authService.hasToken()&&
      !this.authService.hasTokenExpired()){
      this.userId =  this.authService.getLoggedUser().userid;
    }else{
      this.userId = JSON.parse(localStorage.getItem('userIdGuest'));
    }

    await this.http.get<any>(`${this.API_URL}/user/${this.userId}`, httpOptions)
    .toPromise().then(result=>{
      if(result.session!=null)
        this.sessionId = result.session.sessionId;
      this.username = result.username;
    })
    if(this.sessionId==null)
      this.route.navigate(['home']);

    //listen for session killed
    this.socket.fromEvent('killSession').
    subscribe(async id => {
      this.socket.removeAllListeners();
      this.route.navigate(['home']);
    });

    //listen for choices
    this.socket.fromEvent('sendChoices').
    subscribe(async (choices:any) => {
      this.didWinAPoint=null;
      this.choices = choices;
    });

    //listen for result
    this.socket.fromEvent('sendResult').
    subscribe(async (results:any) => {
      for(let result of results){
        if(result==this.choiceBuffer){
          this.score++;
          this.didWinAPoint=true;
          break;
        }else{
          this.didWinAPoint=false;
        }
      }
    });

    //listen for end of question
    this.socket.fromEvent('sendEndOfQuestion').
    subscribe(async sessionId => {
      this.endOfQuestion();
    });
  }

  choose(choiceId:number){
    this.socket.emit('sendResponse',
        {sessionId:this.sessionId,
          response:choiceId});
    this.choiceBuffer = choiceId;
    this.choices = null;
  }

  endOfQuestion(){
    //Send score to host
    this.socket.emit('sendScore',
        {sessionId:this.sessionId,
          username: this.username,
          score:this.score});
  }
}
