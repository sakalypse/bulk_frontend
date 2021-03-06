import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { ToastrService } from 'ngx-toastr';
import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { ChartDataSets } from 'chart.js';
import { Color, Label, defaultColors } from 'ng2-charts';

@Component({
  selector: 'app-host',
  templateUrl: './host.page.html',
  styleUrls: ['./host.page.scss'],
})
export class HostPage implements OnInit {
  
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
  session;
  players;
  category;
  questions;
  playerName=[];
  response=[];
  counterResponse=0;
  choices=[];
  counterScore=0;
  listScore=[];
  showScore=false;
  currentQuestionCounter=0;
  currentQuestion:any;
  
  listResultScore=[];
  listResultPlayer=[];
  listResult=[];
  backgroundColor=[];

  chartOptions = {
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
  barOptions = {
    responsive: true,
    title: {display: false},
    legend: {display:false},
    scales: {
      xAxes: [{
        ticks: {
          beginAtZero:true,
          stepSize: 1
        }
      }],
      yAxes: [{
        ticks: {
          beginAtZero:true,
          stepSize: 1
        }
      }]
    } 
  };

  dataResult=null;
  dataLabel=null;

  finalScoreResult=null;
  finalScoreLabel=null;

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
      this.listResult.push({score:data.score, username:data.username});

      if(this.counterScore>=this.playerName.length){
        this.listResult.sort(function(obj1, obj2) {
          return obj2.score - obj1.score;
        });
        this.listResult.forEach(element => {
          this.listResultScore.push(element.score);
          this.listResultPlayer.push(element.username);
        });
        for(let i=0;i<this.playerName.length;i++){
          this.backgroundColor.push('#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6));
        }
        this.finalScoreResult = [{data:this.listResultScore,
                        backgroundColor: this.backgroundColor}];
        this.finalScoreLabel = this.listResultPlayer;
        this.showScore=true;
      }
      /*
      if(this.counterScore>=this.playerName.length){
        this.listResultScore.sort(function(obj1, obj2) {
          return obj2 - obj1;
        });

        for(let i=0;i<this.playerName.length;i++){
          this.backgroundColor.push('#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6));
        }
        this.finalScoreResult = [{data:this.listResultScore,
                        backgroundColor: this.backgroundColor}];
        this.finalScoreLabel = this.listResultPlayer;
        

        this.showScore=true;
      }
      */
    });

    //envoie les premiers choix après 4 secondes
    //le temps que tout le monde soit connectés
    //Envoi les choix de la première question :
    setTimeout(() => 
    {   
      this.sendChoice();
    }, 4000); 
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

  ionViewDidLeave(){
    this.socket.removeAllListeners();
  }
}
