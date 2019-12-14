import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormControl, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.page.html',
  styleUrls: ['./create-category.page.scss'],
})
export class CreateCategoryPage implements OnInit {
  private categoryForm: FormGroup;
  private name: FormControl;
  private isPublic: FormControl;
  private language: FormControl;

  constructor(
    @Inject(AuthService)
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router) { }

  ngOnInit() {
    this.name = new FormControl('', [Validators.required, Validators.minLength(6)]);
    this.isPublic = new FormControl('', [Validators.required]);
    this.language = new FormControl('', [Validators.required]);
    this.categoryForm = new FormGroup({
      name: this.name,
      isPublic: this.isPublic,
      language: this.language
    });
  }

  categoryCreationForm(){
    //stop if categoryForm invalid
    if (this.categoryForm.invalid) {
      return;
    }

    //THEN POST HERE
  }
}
