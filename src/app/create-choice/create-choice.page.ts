import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { FormControl, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpBackend, HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-create-choice',
  templateUrl: './create-choice.page.html',
  styleUrls: ['./create-choice.page.scss'],
})
export class CreateChoicePage implements OnInit {

  private API_URL = environment.API_URL_DEV;

  private choiceForm: FormGroup;
  private choice: FormControl;
  private question: FormControl;

  private questionId: number;
  private newChoice: any;

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
      this.questionId=navParams.get('questionId');
  }

  ngOnInit() {
    this.choice = new FormControl('', [Validators.required, Validators.maxLength(100)]);
    this.question = new FormControl(this.questionId);
    this.choiceForm = new FormGroup({
      choice: this.choice,
      question : this.question
    });
  }

  choiceCreationForm(){
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
    
    this.http.post<any>(`${this.API_URL}/choice/create`, this.choiceForm.value, httpOptions)
    .subscribe(
      (result) => {
        this.newChoice = result.choice;
      },
      (error) => {
        this.toastr.error(error, 'Creation Error');
      },
      () => {
        this.toastr.success('Choice successfully created', 'Choice creation');

        this.viewCtrl.dismiss({newChoice: this.newChoice});
      });
  }

  dismissModal()
  {
    this.viewCtrl.dismiss({newChoice: null});
  }
}
