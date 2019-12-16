import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { FormControl, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpBackend, HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.page.html',
  styleUrls: ['./create-category.page.scss'],
})
export class CreateCategoryPage implements OnInit {

  private API_URL = environment.API_URL_DEV;

  private categoryForm: FormGroup;
  private name: FormControl;
  private isPublic: FormControl;
  private language: FormControl;
  private owner: FormControl;

  constructor(
    @Inject(AuthService)
    private authService: AuthService,
    handler: HttpBackend,
    private http: HttpClient,
    public storage: Storage,
    private toastr: ToastrService,
    private router: Router) {
      this.http = new HttpClient(handler);
  }

  ngOnInit() {
    this.name = new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]);
    this.isPublic = new FormControl(true);
    this.language = new FormControl(0);
    this.owner = new FormControl(this.authService.getLoggedUser().userid);
    this.categoryForm = new FormGroup({
      name: this.name,
      isPublic: this.isPublic,
      language: this.language,
      owner: this.owner
    });
  }

  categoryCreationForm(){
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
    
    this.http.post<any>(`${this.API_URL}/category/create`, this.categoryForm.value, httpOptions)
    .subscribe(
      (result) => {},
      (error) => {
        this.toastr.error(error, 'Creation Error');
      },
      () => {
        this.toastr.success('Category successfully created', 'Category creation');
        this.router.navigateByUrl("/category");
        window.location.reload();
      });
  }
}
