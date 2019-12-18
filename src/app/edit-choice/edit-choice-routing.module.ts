import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditChoicePage } from './edit-choice.page';

const routes: Routes = [
  {
    path: '',
    component: EditChoicePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditChoicePageRoutingModule {}
