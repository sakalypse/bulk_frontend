import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { FormControl, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpBackend, HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-choice',
  templateUrl: './edit-choice.page.html',
  styleUrls: ['./edit-choice.page.scss'],
})
export class EditChoicePage implements OnInit {

  private API_URL = environment.API_URL_DEV;

  private choiceForm: FormGroup;
  private choice: FormControl;
  private question: FormControl;

  private choiceId: number;

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
          this.choiceId = this.router.getCurrentNavigation().extras.state.choiceId;
        }
      });
  }

  ngOnInit() {
    if (this.choiceId == undefined)
    {
      this.router.navigateByUrl("/category/question/choice");
      return;
    }

    this.choice = new FormControl([Validators.required, Validators.maxLength(100)]);
    this.question = new FormControl();
    this.choiceForm = new FormGroup({
      choice: this.choice,
      question : this.question
    });

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + this.authService.getToken()
      })
    };

    this.http.get<any>(`${this.API_URL}/choice/${this.choiceId}`, httpOptions)
    .subscribe(
      result => {
        this.choice.setValue(result.choice);
        this.question.setValue(result.question);
      }
    );
  }

  choiceUpdateForm(){
    //stop if choiceForm invalid
    if (this.choiceForm.invalid) {
      return;
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + this.authService.getToken()
      })
    };

    console.log(this.choiceForm.value);
    
    this.http.put<any>(`${this.API_URL}/choice/update/${this.choiceId}`, this.choiceForm.value, httpOptions)
    .subscribe(
      (result) => {},
      (error) => {
        this.toastr.error(error, 'Update Error');
      },
      () => {
        this.toastr.success('Choice successfully updated', 'Choice update');
        this.router.navigateByUrl("/category/question/choice");
        //window.location.reload();
      });
  }

}
