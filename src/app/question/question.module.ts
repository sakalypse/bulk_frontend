import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QuestionPageRoutingModule } from './question-routing.module';

import { QuestionPage } from './question.page';
import { CreateQuestionPageModule } from '../create-question/create-question.module';
import { EditQuestionPageModule } from '../edit-question/edit-question.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QuestionPageRoutingModule,
    CreateQuestionPageModule,
    EditQuestionPageModule
  ],
  declarations: [QuestionPage]
})
export class QuestionPageModule {}
