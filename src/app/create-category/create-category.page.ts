import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormControl, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpBackend, HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/internal/operators';
import { throwError, Observable } from 'rxjs';

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
    handler: HttpBackend,
    private http: HttpClient,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router) {
      this.http = new HttpClient(handler);
    }

  ngOnInit() {
    this.name = new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]);
    this.isPublic = new FormControl(true);
    this.language = new FormControl(1);
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

    console.log(this.categoryForm.value);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + this.authService.getToken()
      })
    };

    this.http.post<any>(`${this.API_URL}/category/create`, this.categoryForm.value, httpOptions)
    .pipe(catchError(this.handleError))
    .subscribe(
      result => {
        this.toastr.info(result)
      },
      error => {
        this.toastr.error(error, 'Creation Error');
      },
      () => {
        this.toastr.success('Category successfully created', 'Category creation');
        this.router.navigateByUrl("/");
      });

    //THEN GO BACK TO CATEGORIES
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(error.error.message);
  };
}
