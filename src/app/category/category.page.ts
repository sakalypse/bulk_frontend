import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpBackend, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { NavigationExtras, Router } from '@angular/router';


@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {

  private API_URL = environment.API_URL_DEV;
  private categories;

  constructor(
    @Inject(AuthService)
    private authService: AuthService,
    handler: HttpBackend, 
    private http: HttpClient,
    public storage: Storage,
    private router: Router) {
    this.http = new HttpClient(handler);
  }

  ngOnInit() {
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

  editQuestions(id)
  {
    let navigationExtras: NavigationExtras = {
      state : {
        categoryId: id
      }
    };
    this.router.navigate(['category/question'], navigationExtras);
  }

  addCategory()
  {
    this.router.navigate(['category/create']);
  }
}
