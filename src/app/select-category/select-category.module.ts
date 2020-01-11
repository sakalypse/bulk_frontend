import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectCategoryPageRoutingModule } from './select-category-routing.module';

import { SelectCategoryPage } from './select-category.page';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SelectCategoryPageRoutingModule
  ],
  declarations: [
    SelectCategoryPage
  ]
})
export class SelectCategoryPageModule {}
