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
  API_URL = environment.API_URL_DEV;
  currentUser: any;

  createForm: FormGroup;
  categoryId: FormControl;
  createOrJoin: FormControl;

  joinForm: FormGroup;
  username: FormControl;
  usernameLogged: FormControl;
  roomsCode: FormControl;

  categories;

  constructor(
    @Inject(AuthService)
    public authService: AuthService,
    public toastr: ToastrService,
    handler: HttpBackend, 
    public http: HttpClient,
    public route: Router,
    public socket: Socket) {
      this.http = new HttpClient(handler);
  }

  ngOnInit() {
    this.currentUser = this.authService.getLoggedUser();

    //init control for form
    this.categoryId = new FormControl('', Validators.required);
    this.createForm = new FormGroup({
      categoryId: this.categoryId
    });
    this.username = new FormControl('', [Validators.required, Validators.minLength(3)]);
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
    toPromise().then(
      result => {
        //localStorage.setItem('sessionId', JSON.stringify(result.session));
        this.toastr.success('Session successfully created', 'Session');
        this.route.navigate(["/pre-game"]);
      },
      error => {
        this.toastr.error(error, 'Creation session error');
      }
    );
  }

  async joinSession(){
    if (this.joinForm.invalid) {
      return;
    }

    let data = {
      username: this.joinForm.value.username,
      roomsCode: this.joinForm.value.roomsCode,
      color: '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6)
    }

    let userid;
    //if user not exist, create it
    if(this.authService.hasToken()&&
        !this.authService.hasTokenExpired()){
      userid=this.authService.getLoggedUser().userid;

      //affect random color to user
      this.affectColor(userid);
    }
    else{
      //create user and apply id to 'userid'
      //create localStorage guestId
      await this.http.post<any>(`${this.API_URL}/user/createguest`, data).
      toPromise().then(
        result => {
          localStorage.setItem('userIdGuest', JSON.stringify(result.userId));
          userid = result.userId;
        },
        error => {
          this.toastr.error('Username already taken');
          throw new Error(error);
        }
      ).catch(e => { throw new Error(e);});
    }

    //send added user to web socket
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };
    await this.http.
    put<any>(`${this.API_URL}/session/adduser/${data.roomsCode}`,
      {userId:userid},
      httpOptions).
      toPromise().then(
        result => {
          this.toastr.success('Session successfully joined', 'Session');
          this.route.navigateByUrl('pre-game');
        }
      );    
  }

  async affectColor(userid)
  {
    console.log(userid);
    let generatedColor = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + this.authService.getToken()
      })
    };
    await this.http.
    put<any>(`${this.API_URL}/user/setcolor/${userid}`,
    {color:generatedColor},
      httpOptions).
      toPromise().then(
        result => {
          console.log(result);
        }
      );    
  }
}
