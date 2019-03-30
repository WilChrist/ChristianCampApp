import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule, RoutingComponent } from './dashboard-routing.module';
import {SharedModule} from '../shared/shared.module';
@NgModule({
  declarations: [
    RoutingComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule
  ]
})
export class DashboardModule { }
