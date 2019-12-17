import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { FormControl, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpBackend, HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-question',
  templateUrl: './create-question.page.html',
  styleUrls: ['./create-question.page.scss'],
})
export class CreateQuestionPage implements OnInit {

  private API_URL = environment.API_URL_DEV;

  private questionForm: FormGroup;
  private question: FormControl;
  private hasChoices: FormControl;
  private author: FormControl;
  private category: FormControl;

  private fetchedCategory: number;

  constructor(
    @Inject(AuthService)
    private authService: AuthService,
    handler: HttpBackend,
    private http: HttpClient,
    public storage: Storage,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router) {
      this.http = new HttpClient(handler);
      this.route.queryParams.subscribe(params => {
        if (this.router.getCurrentNavigation().extras.state) {
          this.fetchedCategory = this.router.getCurrentNavigation().extras.state.categoryId;
        }
      });
  }

  ngOnInit() {
    if (this.fetchedCategory == undefined)
    {
      this.router.navigateByUrl("/category");
    }

    this.question = new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]);
    this.hasChoices = new FormControl(false);
    this.author = new FormControl(this.authService.getLoggedUser().userid);
    this.category = new FormControl(this.fetchedCategory);
    this.questionForm = new FormGroup({
      question: this.question,
      hasChoices: this.hasChoices,
      author: this.author,
      category : this.category
    });
  }

  questionCreationForm(){
    //stop if questionForm invalid
    if (this.questionForm.invalid) {
      return;
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + this.authService.getToken()
      })
    };

    console.log(this.questionForm.value);
    
    this.http.post<any>(`${this.API_URL}/question/create`, this.questionForm.value, httpOptions)
    .subscribe(
      (result) => {},
      (error) => {
        this.toastr.error(error, 'Creation Error');
      },
      () => {
        this.toastr.success('Question successfully created', 'Question creation');
        this.router.navigateByUrl("/category/question");
        //window.location.reload();
      });
  }

}
