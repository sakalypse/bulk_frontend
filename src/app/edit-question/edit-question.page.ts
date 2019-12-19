import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { FormControl, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpBackend, HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.page.html',
  styleUrls: ['./edit-question.page.scss'],
})
export class EditQuestionPage implements OnInit {

  private API_URL = environment.API_URL_DEV;

  private questionId: number;
  private updatedQuestion: any;

  private questionForm: FormGroup;
  private question: FormControl;
  private hasChoices: FormControl;
  private author: FormControl;
  private category: FormControl;

  constructor(
    @Inject(AuthService)
    private authService: AuthService,
    handler: HttpBackend,
    private http: HttpClient,
    public storage: Storage,
    private toastr: ToastrService,
    public viewCtrl: ModalController,
    navParams: NavParams) {
      this.http = new HttpClient(handler);
      this.questionId=navParams.get('questionId')
  }

  ngOnInit() {
    this.question = new FormControl([Validators.required, Validators.minLength(6), Validators.maxLength(50)]);
    this.hasChoices = new FormControl();
    this.author = new FormControl(this.authService.getLoggedUser().userid);
    this.category = new FormControl();
    this.questionForm = new FormGroup({
      question: this.question,
      hasChoices: this.hasChoices,
      author: this.author,
      category : this.category
    });

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + this.authService.getToken()
      })
    };

    this.http.get<any>(`${this.API_URL}/question/${this.questionId}`, httpOptions)
    .subscribe(
      result => {
        this.question.setValue(result.question);
        this.hasChoices.setValue(result.hasChoices);
        this.category.setValue(result.category);
      }
    );
  }

  questionUpdateForm(){
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
    
    this.http.put<any>(`${this.API_URL}/question/update/${this.questionId}`, this.questionForm.value, httpOptions)
    .subscribe(
      (result) => {},
      (error) => {
        this.toastr.error(error, 'Update Error');
      },
      () => {
        //get the updated item
        this.http.get<any>(`${this.API_URL}/question/${this.questionId}`, httpOptions)
        .subscribe(
        (result) => {
          this.updatedQuestion = result;
        },
        (error) => {
          this.toastr.error(error, 'Update Error');
        },
        () => {
          this.toastr.success('Question successfully updated', 'Question update');
          
          this.viewCtrl.dismiss({updatedQuestion: this.updatedQuestion});
        });
      });
  }

}
