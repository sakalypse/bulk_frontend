import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpBackend, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';


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
    public storage: Storage) {
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
    let categoriesQuery = this.http.get(`${this.API_URL}/user/${userId}/categories`, httpOptions);
    categoriesQuery.subscribe(
      result => {
        this.categories = result;
      });
  }
}
