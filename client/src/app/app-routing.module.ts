import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [
    {
      path: '',
      loadChildren: './landing/landing.module#LandingModule'
    },

    {
      path: 'dashboard',
      loadChildren: './dashboard/dashboard.module#DashboardModule'
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
