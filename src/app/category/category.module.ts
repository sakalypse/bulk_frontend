import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CategoryPageRoutingModule } from './category-routing.module';

import { CategoryPage } from './category.page';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CreateCategoryPageModule } from '../create-category/create-category.module';
import { EditCategoryPageModule } from '../edit-category/edit-category.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CategoryPageRoutingModule,
    CreateCategoryPageModule,
    EditCategoryPageModule
  ],
  declarations: [CategoryPage]
})
export class CategoryPageModule {}
