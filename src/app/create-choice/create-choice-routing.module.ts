import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateChoicePage } from './create-choice.page';

const routes: Routes = [
  {
    path: '',
    component: CreateChoicePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateChoicePageRoutingModule {}
