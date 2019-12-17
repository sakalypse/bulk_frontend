import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { HttpBackend, HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Router, NavigationExtras } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { AlertController } from '@ionic/angular';

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
    private toastr: ToastrService,
    private router: Router,
    private alertController:AlertController) {
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

  async warn() {
    return new Promise(async (resolve) => {
      const confirm = await this.alertController.create({
        header: 'Category deletion',
        message: 'Are you sure that you want to delete this category and all its questions ?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              return resolve(false);
            },
          },
          {
            text: 'Yes',
            handler: () => {
              return resolve(true);
            },
          },
        ],
      });

      await confirm.present();
    });
  }

  async deleteCategory(id, index)
  {
    // show the user a confirm alert.
    const confirmation = await this.warn();
    // break out of function since they hit cancel.
    if (!confirmation) return;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + this.authService.getToken()
      })
    };
    
    this.http.delete<any>(`${this.API_URL}/category/delete/${id}`, httpOptions)
    .subscribe(
      (result) => {},
      (error) => {
        this.toastr.error(error, 'Deletion Error');
      },
      () => {
        this.toastr.success('Category successfully deleted', 'Category deletion');
        this.ngOnInit();
      });
  }
}
