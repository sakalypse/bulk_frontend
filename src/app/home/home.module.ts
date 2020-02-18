import { NgModule } from '@angular/core';
import { MatExpansionModule, MatFormFieldModule} from '@angular/material';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { SelectCategoryPageModule } from '../select-category/select-category.module';
import { MnFullpageModule } from 'ngx-fullpage';

@NgModule({
  imports: [
    MatExpansionModule,
    MatFormFieldModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MnFullpageModule.forRoot(),
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ]),
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
