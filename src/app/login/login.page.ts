import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  userForm: FormGroup;
  username: FormControl;
  password: FormControl;

  constructor(
    @Inject(AuthService)
    public authService: AuthService,
    public toastr: ToastrService,
    public router: Router) { }

  ngOnInit() {
    this.username = new FormControl('', Validators.required);
    this.password = new FormControl('', Validators.required);
    this.userForm = new FormGroup({
      username: this.username,
      password: this.password
    });
  }

  loginForm(){
    //stop if userForm invalid
    if (this.userForm.invalid) {
      return;
    }
    
    this.authService.login(this.userForm.value).subscribe(
      result => {
        this.authService.setToken(result.access_token)
      },
      error => {
        this.toastr.error(error, 'Authentification Error');
      },
      () => {
        this.toastr.success('Successfully logged in', 'Authentification');
        this.router.navigateByUrl("/");
      })
  }
}
