import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { HttpBackend, HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-select-category',
  templateUrl: './select-category.page.html',
  styleUrls: ['./select-category.page.scss'],
})
export class SelectCategoryPage implements OnInit {

  API_URL = environment.API_URL_DEV;
  categories: any = [];

  userId: number;

  isPublic: boolean = true;
  language: number = null;
  selectedCategory: number = null;

  //toobal tools
  isItemAvailable = true;
  categoriesMemory: any;

  constructor(
    @Inject(AuthService)
    public authService: AuthService,
    handler: HttpBackend,
    public http: HttpClient,
    public storage: Storage,
    public toastr: ToastrService,
    public viewCtrl: ModalController) {
      this.http = new HttpClient(handler);
  }

  ngOnInit() {
    this.userId = this.authService.getLoggedUser().userid;
    this.privacyChange(this.isPublic);
  }

  privacyChange(isPublic){
    this.isPublic = isPublic;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + this.authService.getToken()
      })
    };

    if (this.language == null)
    { 
      if (isPublic) //goes here when appears
      {
        this.http.get(`${this.API_URL}/category/public`, httpOptions)
        .subscribe((result: any) => {
          this.categories = result.filter(x => x.isPublic == this.isPublic && x.questions.length > 0);
          this.categoriesMemory = this.categories; });
      }
      else
      {
        this.http.get(`${this.API_URL}/user/${this.userId}/categories`, httpOptions)
        .subscribe((result: any) => {
          this.categories = result.filter(x => x.isPublic == this.isPublic && x.questions.length > 0);
          this.categoriesMemory = this.categories; });
      } 
    }
    else
    {
      if (isPublic)
      {
        this.http.get(`${this.API_URL}/category/public`, httpOptions)
        .subscribe((result: any) => {
          this.categories = result.filter(x => x.isPublic == this.isPublic && x.language == this.language && x.questions.length > 0);
          this.categoriesMemory = this.categories; });                          
      }
      else
      {
        this.http.get(`${this.API_URL}/user/${this.userId}/categories`, httpOptions)
        .subscribe((result: any) => {
          this.categories = result.filter(x => x.isPublic == this.isPublic && x.language == this.language && x.questions.length > 0);
          this.categoriesMemory = this.categories; });
      }
    }
  }

  languageChange(language)
  {
    this.language = language;

    this.privacyChange(this.isPublic);
  }

  getItems(ev: any) {  
    const val = ev.target.value; // set val to the value of the searchbar

    if (val == '')
    {
      this.categories = this.categoriesMemory;
    }
   
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
        this.isItemAvailable = true;
        this.categories = this.categoriesMemory.filter((category) => {
          return (category.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
    }
  }

  selectCategory(categoryId)
  {
    this.selectedCategory = categoryId;
  }

  confirmCategory()
  {
    this.viewCtrl.dismiss({selectedCategory: this.selectedCategory});
  }

  dismissModal()
  {
    this.viewCtrl.dismiss({selectedCategory : this.selectedCategory});
  }
}
