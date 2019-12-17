import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateQuestionPageRoutingModule } from './create-question-routing.module';

import { CreateQuestionPage } from './create-question.page';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CreateQuestionPageRoutingModule
  ],
  declarations: [CreateQuestionPage]
})
export class CreateQuestionPageModule {}
