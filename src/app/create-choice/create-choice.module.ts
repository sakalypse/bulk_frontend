import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateChoicePageRoutingModule } from './create-choice-routing.module';

import { CreateChoicePage } from './create-choice.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CreateChoicePageRoutingModule
  ],
  declarations: [CreateChoicePage]
})
export class CreateChoicePageModule {}
