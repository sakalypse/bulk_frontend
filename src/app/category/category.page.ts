import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {

  constructor(
    @Inject(AuthService)
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

}
