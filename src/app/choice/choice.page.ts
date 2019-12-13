import { Component, OnInit, Inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../shared/auth.service';
import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-choice',
  templateUrl: './choice.page.html',
  styleUrls: ['./choice.page.scss'],
})
export class ChoicePage implements OnInit {

  private API_URL = environment.API_URL_DEV;
  private choices;
  questionId: number;

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
        this.questionId = this.router.getCurrentNavigation().extras.state.questionId;
      }
    });
  }

  ngOnInit() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + this.authService.getToken()
      })
    };

    let userChoices = this.http.get(`${this.API_URL}/question/${this.questionId}/choices`, httpOptions);
    userChoices.subscribe(
      result => {
        this.choices = result;
      });
  }

}
