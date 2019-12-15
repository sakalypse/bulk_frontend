import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse, HttpBackend, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from "rxjs/internal/operators";


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  private API_URL = environment.API_URL_DEV;
  currentUser: any;

  private createForm: FormGroup;
  private category: FormControl;
  private createOrJoin: FormControl;

  private joinForm: FormGroup;
  private username: FormControl;
  private roomsCode: FormControl;

  private categories;

  constructor(
    @Inject(AuthService)
    private authService: AuthService,
    private toastr: ToastrService,
    private handler: HttpBackend, 
    private http: HttpClient,
    private route: Router) {
      this.http = new HttpClient(handler);
  }

  ngOnInit() {
    this.currentUser = this.authService.getLoggedUser();

    //init control for form
    this.createOrJoin = new FormControl('', Validators.required);
    this.category = new FormControl('', Validators.required);
    this.createForm = new FormGroup({
      category: this.category,
      createOrJoin: this.createOrJoin
    });
    this.username = new FormControl('', Validators.required);
    this.roomsCode = new FormControl('', Validators.required);
    this.joinForm = new FormGroup({
      username: this.username,
      roomsCode: this.roomsCode,
      createOrJoin: this.createOrJoin
    });

    
    //fetch categories for
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
      category: this.createForm.value.category,
      user: [this.createForm.value.username]
    }
    this.http.post<any>(`${this.API_URL}/session/create`, data).
    subscribe(
      result => {
        localStorage.setItem('sessionId', JSON.stringify(result.data.sessionId));
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

  logout() {
    this.authService.clearStorage();
    this.route.navigateByUrl('/');
    this.toastr.success('Successfully logged out', 'Authentification');
  }

}
