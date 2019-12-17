import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse, HttpBackend, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from "rxjs/internal/operators";
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  private API_URL = environment.API_URL_DEV;
  currentUser: any;

  private createForm: FormGroup;
  private categoryId: FormControl;
  private createOrJoin: FormControl;

  private joinForm: FormGroup;
  private username: FormControl;
  private usernameLogged: FormControl;
  private roomsCode: FormControl;

  private categories;

  constructor(
    @Inject(AuthService)
    private authService: AuthService,
    private toastr: ToastrService,
    private handler: HttpBackend, 
    private http: HttpClient,
    private route: Router,
    private socket: Socket) {
      this.http = new HttpClient(handler);
  }

  ngOnInit() {
    this.currentUser = this.authService.getLoggedUser();

    //init control for form
    this.categoryId = new FormControl('', Validators.required);
    this.createForm = new FormGroup({
      categoryId: this.categoryId
    });
    this.username = new FormControl('', Validators.required);
    this.usernameLogged = new FormControl('');
    this.roomsCode = new FormControl('', Validators.required);
    if(this.authService.hasToken()&&!this.authService.hasTokenExpired()){
      this.joinForm = new FormGroup({
        usernameLogged: this.usernameLogged,
        roomsCode: this.roomsCode
      });
    }
    else{
      this.joinForm = new FormGroup({
        username: this.username,
        roomsCode: this.roomsCode
      });
    }

    
    //fetch categories for "host"
    if(this.authService.hasToken()&&!this.authService.hasTokenExpired()){
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer ' + this.authService.getToken()
        })
      };
  
      let userId = this.authService.getLoggedUser().userid;
      let userCategories = this.http.get(`${this.API_URL}/user/${userId}/categories`, httpOptions);
      userCategories.subscribe(
        result => {
          this.categories = result;
        });
    }
  }

  createSession() {
    if (this.createForm.invalid) {
      return;
    }
    let data = {
      category: this.createForm.value.categoryId,
      owner: this.authService.getLoggedUser().userid
    }
    this.http.post<any>(`${this.API_URL}/session/create`, data).
    subscribe(
      result => {
        localStorage.setItem('sessionId', JSON.stringify(result.sessionId));
      },
      error => {
        this.toastr.error(error, 'Creation session error');
      },
      () => {
        this.toastr.success('Session successfully created', 'Session');
        this.route.navigateByUrl("/pre-game");
      }
    );
  }

  async joinSession(){
    if (this.joinForm.invalid) {
      return;
    }

    let data = {
      username: this.joinForm.value.username,
      roomsCode: this.joinForm.value.roomsCode
    }

    //if user not exist, create it
    const userid=this.authService.getLoggedUser().userid;
    if(!userid){
      //TODO
      //create user and apply id to 'userid'
    }

    //send
    await this.socket.
              emit('joinSession', userid, data.roomsCode);
    this.toastr.success('Session successfully joined', 'Session');
    this.route.navigateByUrl("/pre-game")
    
    //receive
    //return this.socket.fromEvent('chat');
  }

}
