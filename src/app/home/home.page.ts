import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  currentUser: any;

  constructor(
    @Inject(AuthService)
    private authService: AuthService,
    private toastr: ToastrService,
    private route: Router) {
  }

  ngOnInit() {
    this.currentUser = this.authService.getLoggedUser();
  }

  logout() {
    this.authService.clearStorage();
    this.route.navigateByUrl('/');
    this.toastr.success('Successfully logged out', 'Authentification');
  }

}
