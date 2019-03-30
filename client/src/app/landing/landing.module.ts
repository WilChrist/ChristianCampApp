import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LandingRoutingModule,RoutingComponent} from './landing-routing.module';
import {SharedModule} from '../shared/shared.module';
@NgModule({
  declarations: [
    RoutingComponent
  ],
  imports: [
    CommonModule,
    LandingRoutingModule,
    SharedModule
  ]
})
export class LandingModule { }
