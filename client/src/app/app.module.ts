import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LandingComponent } from './landing/landing.component';
import { HeaderComponent } from './landing/header/header.component';
import { FooterComponent } from './landing/footer/footer.component';
import { BodyComponent } from './landing/body/body.component';
import { ParticipantComponent } from './participant/participant.component';
import { ParticipantListComponent } from './participant/participant-list/participant-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidenavdComponent } from './dashboard/sidenavd/sidenavd.component';
import { HeaderdComponent } from './dashboard/headerd/headerd.component';
import { BodydComponent } from './dashboard/bodyd/bodyd.component';
import { FooterdComponent } from './dashboard/footerd/footerd.component';
@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    HeaderComponent,
    FooterComponent,
    BodyComponent,
    ParticipantComponent,
    ParticipantListComponent,
    DashboardComponent,
    HeaderComponent,
    SidenavdComponent,
    HeaderdComponent,
    BodydComponent,
    FooterdComponent
  ],
  imports: [
    BrowserModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
