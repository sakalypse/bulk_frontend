import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChoicePageRoutingModule } from './choice-routing.module';

import { ChoicePage } from './choice.page';
import { CreateChoicePageModule } from '../create-choice/create-choice.module';
import { EditChoicePageModule } from '../edit-choice/edit-choice.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChoicePageRoutingModule,
    CreateChoicePageModule,
    EditChoicePageModule
  ],
  declarations: [ChoicePage]
})
export class ChoicePageModule {}
