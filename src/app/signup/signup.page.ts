import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  userForm: FormGroup;
  username: FormControl;
  email: FormControl;
  password: FormControl;
  password2: FormControl;

  constructor(
    @Inject(AuthService)
    public authService: AuthService,
    public toastr: ToastrService,
    public router: Router) { }

  ngOnInit() {
    this.username = new FormControl('', [Validators.required, Validators.minLength(6)]);
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.password = new FormControl('', [Validators.required, Validators.minLength(6)]);
    this.password2 = new FormControl('', [Validators.required, Validators.minLength(6)]);
    this.userForm = new FormGroup({
      username: this.username,
      email: this.email,
      password: this.password,
      password2: this.password2
    });
  }

  signupForm(){
    //stop if userForm invalid
    if (this.userForm.invalid) {
      return;
    }
    if (this.password.value != this.password2.value) {
      this.toastr.warning('Passwords are not matching')
      return;
    }

    this.authService.signup(this.userForm.value)
    .subscribe(x => {
      let formLogin = {
                        username: this.userForm.value.username,
                        password: this.userForm.value.password
                      }
      this.authService.login(formLogin).subscribe(
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
      },
      error =>
      {
        this.toastr.error(error, error);
      }
    );
  }
}
