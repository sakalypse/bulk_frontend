import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditChoicePageRoutingModule } from './edit-choice-routing.module';

import { EditChoicePage } from './edit-choice.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    EditChoicePageRoutingModule
  ],
  declarations: [EditChoicePage]
})
export class EditChoicePageModule {}
