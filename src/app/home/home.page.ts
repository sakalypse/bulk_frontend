import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse, HttpBackend, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from "rxjs/internal/operators";
import { Socket } from 'ngx-socket-io';
import { ModalController, AlertController } from '@ionic/angular';
import { SelectCategoryPage } from '../select-category/select-category.page';
import { MnFullpageOptions } from 'ngx-fullpage';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  API_URL = environment.API_URL_DEV;
  currentUser: any;

  joinForm: FormGroup;
  username: FormControl;
  usernameLogged: FormControl;
  roomsCode: FormControl;

  categories;
  selectedCategory = null;
  selectedCategoryName;
  selectedCategoryQuestionsLength;

  expandHowToPlay = true;
  expandHostGame = false;
  expandJoinGame = false;
  MnFullpageOptions;

  constructor(
    @Inject(AuthService)
    public authService: AuthService,
    public modalController: ModalController,
    public toastr: ToastrService,
    handler: HttpBackend, 
    public http: HttpClient,
    public route: ActivatedRoute,
    public router: Router,
    public alertController:AlertController,
    public socket: Socket) {
      this.http = new HttpClient(handler);
  }

  ngOnInit() {
    this.currentUser = this.authService.getLoggedUser();

    //init control for form
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


    this.MnFullpageOptions = MnFullpageOptions.create({
      controlArrows: false,
      scrollingSpeed: 1000,

      menu: '.menu',
      css3: true,
      anchors: [
          'menuAnchor1', 'menuAnchor2', 'menuAnchor3',
          'menuAnchor4', 'menuAnchor5', 'menuAnchor6'
      ]
  });
  }

  createSession() {
    let data = {
      category: this.selectedCategory,
      owner: this.authService.getLoggedUser().userid
    }
    this.http.post<any>(`${this.API_URL}/session/create`, data).
    toPromise().then(
      result => {
        //localStorage.setItem('sessionId', JSON.stringify(result.session));
        this.toastr.success('Session successfully created', 'Session');
        this.router.navigate(["/pre-game"]);
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
    }

    let userid;
    //if user not exist, create it
    if(this.authService.hasToken()&&
        !this.authService.hasTokenExpired()){
      userid=this.authService.getLoggedUser().userid;
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
          this.router.navigateByUrl('pre-game');
        }
      );    
  }

  selectCategory()
  {
    this.presentSelectModal();
  }

  async presentSelectModal() {
    const modal = await this.modalController.create({
      component: SelectCategoryPage
    });
    modal.onDidDismiss().then((data:any)=>{
      if (data.data.selectedCategory != null)
      {
        this.selectedCategory = data.data.selectedCategory;
        
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type':  'application/json',
            'Authorization': 'Bearer ' + this.authService.getToken()
          })
        };
    
        this.http.get<any>(`${this.API_URL}/category/${this.selectedCategory}`, httpOptions)
        .subscribe(
          result => {
            this.selectedCategoryName = result.name;          }
        );
      }
      });
    return await modal.present();
  }

  HowToPlayExpand()
  {
    this.expandHowToPlay = true;
    this.expandHostGame = false;
    this.expandJoinGame = false;
  }

  HostGameExpand()
  {
    this.expandHostGame = true;
    this.expandHowToPlay = false;
    this.expandJoinGame = false;
  }

  JoinGameExpand()
  {
    this.expandJoinGame = true;
    this.expandHowToPlay = false;
    this.expandHostGame = false;
  }
}
