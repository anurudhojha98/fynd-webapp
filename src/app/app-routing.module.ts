import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MovieListComponent } from './components/movie-list/movie-list.component';

const routes: Routes = [
  {
    path:'',redirectTo:'/movies-list',pathMatch:'full'
  },
  {
    path:'login',component:LoginComponent
  },
  {
    path:'movies-list',component:MovieListComponent
  },
  {
    path:'**',redirectTo:'/movies-list',pathMatch:'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
