import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { HttpHeaders, HttpBackend, HttpClient } from '@angular/common/http';
import { AuthService } from '../shared/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-question',
  templateUrl: './question.page.html',
  styleUrls: ['./question.page.scss'],
})
export class QuestionPage implements OnInit {

  private API_URL = environment.API_URL_DEV;
  private questions;
  categoryId: number;

  constructor(
    @Inject(AuthService)
    private authService: AuthService,
    handler: HttpBackend, 
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
    ) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.categoryId = this.router.getCurrentNavigation().extras.state.categoryId;
      }
    });
  }

  ngOnInit() {
    if (this.categoryId == undefined)
    {
      this.router.navigateByUrl("/category");
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + this.authService.getToken()
      })
    };

    let userQuestions = this.http.get(`${this.API_URL}/category/${this.categoryId}/questions`, httpOptions);
    userQuestions.subscribe(
      result => {
        this.questions = result;
      });
  }

  editChoices(id)
  {
    let navigationExtras: NavigationExtras = {
      state : {
        questionId: id
      }
    };
    this.router.navigate(['category/question/choice'], navigationExtras);
  }

  addQuestion()
  {
    let navigationExtras: NavigationExtras = {
      state : {
        categoryId: this.categoryId
      }
    };
    this.router.navigate(['question/create'], navigationExtras);
  }

  deleteQuestion(id)
  {
    
  }
}
