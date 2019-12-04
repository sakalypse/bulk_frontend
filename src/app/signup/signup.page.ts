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
  private userForm: FormGroup;
  private username: FormControl;
  private email: FormControl;
  private password: FormControl;

  constructor(
    @Inject(AuthService)
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router) { }

  ngOnInit() {
    this.username = new FormControl('', [Validators.required, Validators.minLength(6)]);
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.password = new FormControl('', [Validators.required, Validators.minLength(6)]);
    this.userForm = new FormGroup({
      username: this.username,
      email: this.email,
      password: this.password
    });
  }

  signupForm(){
    //stop if userForm invalid
    if (this.userForm.invalid) {
      return;
    }

    this.authService.signup(this.userForm.value).subscribe(
      result => {
        this.authService.setToken(result.data)
      },
      error => {
        this.toastr.error(error, 'Authentification Error');
      },
      () => {
        this.toastr.success('Successfully signed up', 'Authentification');
        this.router.navigateByUrl("/");
      })
  }
}
