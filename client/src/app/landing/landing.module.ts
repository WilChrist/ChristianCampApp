import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LandingRoutingModule,RoutingComponent} from './landing-routing.module';
import {SharedModule} from '../shared/shared.module';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    RoutingComponent
  ],
  imports: [
    CommonModule,
    LandingRoutingModule,
    SharedModule,
    FormsModule
  ]
})
export class LandingModule { }
