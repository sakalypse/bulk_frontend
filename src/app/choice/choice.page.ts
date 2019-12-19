import { Component, OnInit, Inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../shared/auth.service';
import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
import { CreateChoicePage } from '../create-choice/create-choice.page';
import { EditChoicePage } from '../edit-choice/edit-choice.page';

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
    public modalController: ModalController,
    handler: HttpBackend, 
    private http: HttpClient,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private alertController:AlertController
    ) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.questionId = this.router.getCurrentNavigation().extras.state.questionId;
      }
    });
  }

  ngOnInit() {
    if (this.questionId == undefined)
    {
      console.log("questionId undefined")
      this.router.navigateByUrl("/category/question");
      return;
    }

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

  addChoice()
  {
    this.presentAddModal();
  }


  async deleteChoice(id)
  {
    // show the user a confirm alert.
    const confirmation = await this.warn();
    // break out of function since they hit cancel.
    if (!confirmation) return;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + this.authService.getToken()
      })
    };
    
    this.http.delete<any>(`${this.API_URL}/choice/delete/${id}`, httpOptions)
    .subscribe(
      (result) => {},
      (error) => {
        this.toastr.error(error, 'Deletion Error');
      },
      () => {
        this.toastr.success('Choice successfully deleted', 'Choice deletion');
        this.choices = this.choices.
                        filter(x => x.choiceId !== id);
      });
  }

  editChoice(id)
  {
    this.presentEditModal(id);
  }

  async warn() {
    return new Promise(async (resolve) => {
      const confirm = await this.alertController.create({
        header: 'Question deletion',
        message: 'Are you sure that you want to delete this question ?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              return resolve(false);
            },
          },
          {
            text: 'Yes',
            handler: () => {
              return resolve(true);
            },
          },
        ],
      });

      await confirm.present();
    });
  }

  async presentAddModal() {
    const modal = await this.modalController.create({
      component: CreateChoicePage,
      componentProps: { questionId: this.questionId }
    });
    modal.onDidDismiss().then((data:any)=>{
      this.choices.push(data.data.newChoice);
      });
    return await modal.present();
  }

  async presentEditModal(id: number) {
    const modal = await this.modalController.create({
      component: EditChoicePage,
      componentProps: { choiceId: id }
    });
    modal.onDidDismiss().then((data:any)=>{
      this.choices = this.choices.
                        filter(x => x.choiceId !== data.data.updatedChoice.choiceId);

      this.choices.push(data.data.updatedChoice);
      });
    return await modal.present();
  }
}
