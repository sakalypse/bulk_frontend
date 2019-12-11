import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  currentUser: any;

  private createForm: FormGroup;
  private category: FormControl;
  private createOrJoin: FormControl;

  private joinForm: FormGroup;
  private username: FormControl;
  private roomsCode: FormControl;

  constructor(
    @Inject(AuthService)
    private authService: AuthService,
    private toastr: ToastrService,
    private route: Router) {
  }

  ngOnInit() {
    this.currentUser = this.authService.getLoggedUser();

    //init control for form
    this.createOrJoin = new FormControl('', Validators.required);

    this.category = new FormControl('', Validators.required);
    this.createForm = new FormGroup({
      category: this.category,
      createOrJoin: this.createOrJoin
    });
    this.username = new FormControl('', Validators.required);
    this.roomsCode = new FormControl('', Validators.required);
    this.joinForm = new FormGroup({
      username: this.username,
      roomsCode: this.roomsCode,
      createOrJoin: this.createOrJoin
    });
  }

  logout() {
    this.authService.clearStorage();
    this.route.navigateByUrl('/');
    this.toastr.success('Successfully logged out', 'Authentification');
  }

}
