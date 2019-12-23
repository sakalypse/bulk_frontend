import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { ToastrService } from 'ngx-toastr';
import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';

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
  private choices=[];
  private counterScore=0;
  private listScore=[];
  private showScore=false;

  private currentQuestionCounter;
  private currentQuestion:any;

  private chartOptions = {
    responsive: true,
    title: {
      display: true,
      text: 'Result :'
    },
    legend: {
      labels: {
          fontSize: 30
      }
    }
  };
  private dataResult=null;
  private dataLabel=null;

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
    if(this.sessionId==null)
      this.route.navigate(['home']);

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
    await this.http.
    get<any>(`${this.API_URL}/category/${this.category.categoryId}/questions`,
    httpOptions)
    .toPromise().then(
      result => {
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

    //listen for score
    this.socket.fromEvent('sendScore').
    subscribe(async (data:any) => {
      this.counterScore++;
      this.listScore.push({username:data.username,
                            score:data.score})
      if(this.counterScore>=this.playerName.length){
        this.listScore.sort(function(obj1, obj2) {
          // Ascending: first age less than the previous
          return obj2.score - obj1.score;
        });
        this.showScore=true;
      }
    });
  }

  sendChoice(){
    this.choices=[];
    if(this.currentQuestion.hasChoices){
      this.currentQuestion.choices.forEach(choice => {
        this.choices.push(choice.choice);
      });
    }else{
      this.playerName.forEach(player => {
        this.choices.push(player);
      });
    }
    //send choices
    this.socket.emit('sendChoices',
        {sessionId:this.sessionId,
          choices:this.choices});
    //init responses
    this.response = [];
    this.choices.forEach(choice => {
      this.response.push(0);
    });
  }

  result(){
    //Show pie chart
    this.dataResult = [{data:this.response}];
    this.dataLabel = this.choices;

    //send result to players
    const max = Math.max(...this.response);
    const resultToSend = [];
    this.response.forEach(
      (item, index) => item === max ? resultToSend.push(index): null);

    this.socket.emit('sendResult',
      {sessionId:this.sessionId,
        result:resultToSend});

    setTimeout(() => 
    {   
      this.nextQuestion();
      this.dataResult = null;
      this.dataLabel = null;
    }, 5000);  
    
  }

  nextQuestion(){
    this.currentQuestionCounter++;
    if(this.currentQuestionCounter>=this.questions.length)
      this.endGame();
    else{
      this.currentQuestion = this.questions[this.currentQuestionCounter];
      this.counterResponse=0;
      this.sendChoice();
    }
  }

  endGame(){
    this.socket.emit('sendEndOfQuestion',this.sessionId);
    this.currentQuestion = null;
  }

  delete(){
    this.http.delete<any>(`${this.API_URL}/session/delete/${this.sessionId}`).
    subscribe(
      result => {
        this.socket.emit('killSession', this.sessionId);
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
