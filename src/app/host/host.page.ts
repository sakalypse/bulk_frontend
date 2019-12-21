import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { ToastrService } from 'ngx-toastr';
import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-host',
  templateUrl: './host.page.html',
  styleUrls: ['./host.page.scss'],
})
export class HostPage implements OnInit {
  
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
  private session;
  private players;
  private category;
  private questions;
  private playerName=[];
  private response=[];
  private counterResponse=0;

  private currentQuestionCounter;
  private currentQuestion:any;

  async ngOnInit() {
    this.currentQuestion="";
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

    await this.http.get<any>(`${this.API_URL}/user/${this.userId}`, httpOptions)
    .toPromise().then(result=>{
      if(result.sessionHost!=null)
        this.sessionId = result.sessionHost.sessionId;
    })

    //fetch session
    await this.http.get<any>(`${this.API_URL}/session/${this.sessionId}`, httpOptions)
    .toPromise().then(
      result => {
        this.players = result.players;
        this.session = result;
        this.category = result.category;
    });
    this.players.forEach(player => {
      this.playerName.push(player.username);
    });

    //fetch questions
    console.log(this.category);
    await this.http.
    get<any>(`${this.API_URL}/category/${this.category.categoryId}/questions`,
    httpOptions)
    .toPromise().then(
      result => {
        console.log(result);
        this.questions = result;
        this.currentQuestionCounter = 0;
        this.currentQuestion = this.questions[this.currentQuestionCounter];
    });

    //Envoi les choix de la première question :
    this.sendChoice();

    //listen for response
    this.socket.fromEvent('sendResponse').
    subscribe(async (id:number) => {
      this.counterResponse++;
      this.response[id]++;
      if(this.counterResponse>=this.playerName.length){
        this.result();
      }
    });

    /*
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
      this.route.navigateByUrl("/game");
    });
    */
  }

  sendChoice(){
    let choices;
    if(this.currentQuestion.hasChoices){
      choices = this.currentQuestion.choices
    }else{
      choices = this.playerName;
    }
    //send choices
    this.socket.emit('sendChoice',
        {sessionId:this.sessionId,
          choices:choices});
    //init responses
    this.response = [];
    choices.forEach(choice => {
      this.response.push(0);
    });
  }

  result(){
    console.log(Math.max.apply(Math,this.response));
    setTimeout(() => 
    {   
      this.nextQuestion();
    }, 3000);  
  }

  nextQuestion(){
    this.currentQuestionCounter++;
    if(this.currentQuestion>=this.questions.length)
      this.endGame();

    this.currentQuestion = this.questions[this.currentQuestionCounter];
    this.counterResponse=0;
    this.sendChoice();
  }

  endGame(){
    //TODO
    console.log("endGame");
  }
}
