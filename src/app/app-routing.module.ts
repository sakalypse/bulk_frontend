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
  },
  {
    path: 'category/create', canActivate: [AuthGuardService],
    loadChildren: () => import('./create-category/create-category.module').then( m => m.CreateCategoryPageModule)
  },
  {
    path: 'category/question/create', canActivate: [AuthGuardService],
    loadChildren: () => import('./create-question/create-question.module').then( m => m.CreateQuestionPageModule)
  },
  {
    path: 'category/question/choice/create', canActivate: [AuthGuardService],
    loadChildren: () => import('./create-choice/create-choice.module').then( m => m.CreateChoicePageModule)
  },
  {
    path: 'category/edit', canActivate: [AuthGuardService],
    loadChildren: () => import('./edit-category/edit-category.module').then( m => m.EditCategoryPageModule)
  },
  {
    path: 'category/question/edit', canActivate: [AuthGuardService],
    loadChildren: () => import('./edit-question/edit-question.module').then( m => m.EditQuestionPageModule)
  },
  {
    path: 'category/question/choice/edit', canActivate: [AuthGuardService],
    loadChildren: () => import('./edit-choice/edit-choice.module').then( m => m.EditChoicePageModule)
  },
  {path: '**', redirectTo: '/home'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
