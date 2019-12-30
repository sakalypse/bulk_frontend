import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { HttpBackend, HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { AlertController, ModalController, NavParams } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.page.html',
  styleUrls: ['./edit-category.page.scss'],
})
export class EditCategoryPage implements OnInit {

  API_URL = environment.API_URL_DEV;

  categoryId: number;
  updatedCategory: any;

  categoryForm: FormGroup;
  name: FormControl;
  isPublic: FormControl;
  language: FormControl;
  owner: FormControl;

  constructor(
    @Inject(AuthService)
    public authService: AuthService,
    handler: HttpBackend,
    public http: HttpClient,
    public storage: Storage,
    public toastr: ToastrService,
    public viewCtrl: ModalController,
    navParams: NavParams) {
      this.http = new HttpClient(handler);
      this.categoryId=navParams.get('categoryId')
  }

  ngOnInit() {
    this.name = new FormControl([Validators.required, Validators.minLength(6), Validators.maxLength(50)]);
          this.isPublic = new FormControl();
          this.language = new FormControl();
          this.owner = new FormControl();
          this.categoryForm = new FormGroup({
            name: this.name,
            isPublic: this.isPublic,
            language: this.language,
            owner: this.owner
          });

          console.log(this.language);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + this.authService.getToken()
      })
    };

    this.http.get<any>(`${this.API_URL}/category/${this.categoryId}`, httpOptions)
    .subscribe(
      result => {
        this.name.setValue(result.name);
        this.isPublic.setValue(result.isPublic);
        this.language.setValue(result.language);
        this.owner.setValue(result.owner);
      }
    );
  }

  categoryUpdateForm(){
    //stop if categoryForm invalid
    if (this.categoryForm.invalid) {
      return;
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + this.authService.getToken()
      })
    };
    
    this.http.put<any>(`${this.API_URL}/category/update/${this.categoryId}`, this.categoryForm.value, httpOptions)
    .subscribe(
      (result) => {
        //update results can be fetched here
      },
      (error) => {
        this.toastr.error(error, 'Update Error');
      },
      () => {
        //get the updated item
        this.http.get<any>(`${this.API_URL}/category/${this.categoryId}`, httpOptions)
        .subscribe(
        (result) => {
          this.updatedCategory = result;
        },
        (error) => {
          this.toastr.error(error, 'Update Error');
        },
        () => {
          this.toastr.success('Category successfully updated', 'Category update');
          
          this.viewCtrl.dismiss({updatedCategory: this.updatedCategory});
        });
      });
  }

  dismissModal()
  {
    this.viewCtrl.dismiss({updatedCategory: null});
  }
}
