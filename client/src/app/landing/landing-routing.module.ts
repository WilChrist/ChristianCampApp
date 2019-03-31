import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LandingComponent} from './landing.component';
import {BodyComponent} from './body/body.component';
import {ParticipantComponent} from './participant/participant.component';
import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './footer/footer.component';
import {EvaluationComponent} from './evaluation/evaluation.component'
const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    children: [
      {
        path: '',
        component: BodyComponent
      },
      {
        path: 'inscription',
        component: ParticipantComponent
      },
      {
        path: 'liste',
        component: ParticipantComponent
      },
      {
        path:'evaluation',
        component: EvaluationComponent
      },
      {
        path:'apropos',
        component: ParticipantComponent
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingRoutingModule { }
export const RoutingComponent=[
  LandingComponent,
  BodyComponent,
  ParticipantComponent,
  HeaderComponent,
  FooterComponent,
  EvaluationComponent
]