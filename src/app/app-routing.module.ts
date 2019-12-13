import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './shared/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'list',
    loadChildren: () => import('./list/list.module').then(m => m.ListPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'category',  canActivate: [AuthGuardService],
    loadChildren: () => import('./category/category.module').then( m => m.CategoryPageModule)
  },
  {
    path: 'game', canActivate: [AuthGuardService],
    loadChildren: () => import('./game/game.module').then( m => m.GamePageModule)
  },
  {
    path: 'pre-game', canActivate: [AuthGuardService],
    loadChildren: () => import('./pre-game/pre-game.module').then( m => m.PreGamePageModule)
  },
  {
    path: 'category/question', canActivate: [AuthGuardService],
    loadChildren: () => import('./question/question.module').then( m => m.QuestionPageModule)
  },
  {
    path: 'category/question/choice', canActivate: [AuthGuardService],
    loadChildren: () => import('./choice/choice.module').then( m => m.ChoicePageModule)
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
