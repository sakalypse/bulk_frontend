import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateCategoryPageRoutingModule } from './create-category-routing.module';

import { CreateCategoryPage } from './create-category.page';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CreateCategoryPageRoutingModule
  ],
  declarations: [CreateCategoryPage]
})
export class CreateCategoryPageModule {}
