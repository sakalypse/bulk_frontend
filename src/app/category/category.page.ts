import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { HttpBackend, HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { AlertController, ModalController } from '@ionic/angular';
import { CreateCategoryPage } from '../create-category/create-category.page';
import { EditCategoryPage } from '../edit-category/edit-category.page';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {

  API_URL = environment.API_URL_DEV;
  categories;

  constructor(
    @Inject(AuthService)
    public authService: AuthService,
    public modalController: ModalController,
    handler: HttpBackend,
    public http: HttpClient,
    public storage: Storage,
    public toastr: ToastrService,
    public route: ActivatedRoute,
    public router: Router,
    public alertController:AlertController) {
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
    this.http.get(`${this.API_URL}/user/${userId}/categories`, httpOptions)
    .subscribe(
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
    this.presentAddModal();
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
        this.categories = this.categories.
                        filter(x => x.categoryId !== id);
      });
  }

  editCategory(id)
  {
    this.presentEditModal(id);
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

  async presentAddModal() {
    const modal = await this.modalController.create({
      component: CreateCategoryPage
    });
    modal.onDidDismiss().then((data:any)=>{
      if (data.data.newCategory != null)
      {
        this.categories.push(data.data.newCategory);
      }
      });
    return await modal.present();
  }

  async presentEditModal(id: number) {
    const modal = await this.modalController.create({
      component: EditCategoryPage,
      componentProps: { categoryId: id }
    });
    modal.onDidDismiss().then((data:any)=>{
      if (data.data.updatedCategory != null)
      {
        this.categories = this.categories.
                          filter(x => x.categoryId !== data.data.updatedCategory.categoryId);
        this.categories.push(data.data.updatedCategory);
      }
      });
    return await modal.present();
  }
}
