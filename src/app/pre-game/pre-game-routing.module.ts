import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PreGamePage } from './pre-game.page';

const routes: Routes = [
  {
    path: '',
    component: PreGamePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PreGamePageRoutingModule {}
