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
  private authService: AuthService,
  private toastr: ToastrService,
  private handler: HttpBackend, 
  private http: HttpClient,
  private route: Router,
  private socket:Socket) {
    this.http = new HttpClient(handler);
  }

  private API_URL = environment.API_URL_DEV;
  private userId;
  private sessionId;
  private choices;

  async ngOnInit() {
    this.choices=null;
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
    })
    if(this.sessionId==null)
      this.route.navigate(['home']);

    //listen for choices
    this.socket.fromEvent('sendChoices').
    subscribe(async (choices:any) => {
      this.choices = choices;
    });
  }

  choose(choiceId:number){
    this.socket.emit('sendResponse',
        {sessionId:this.sessionId,
          response:choiceId});
    this.choices = null;
  }
}
