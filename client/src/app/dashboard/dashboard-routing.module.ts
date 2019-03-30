import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BodydComponent} from './bodyd/bodyd.component';
import {FooterdComponent} from  './footerd/footerd.component';
import {HeaderdComponent} from './headerd/headerd.component';
import {SidenavdComponent} from './sidenavd/sidenavd.component';
import {DashboardComponent} from './dashboard.component';
const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        component: BodydComponent
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
export const RoutingComponent = [DashboardComponent,BodydComponent,HeaderdComponent,FooterdComponent,SidenavdComponent];