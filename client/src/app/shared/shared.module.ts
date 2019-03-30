import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ParticipantListComponent} from './participant-list/participant-list.component';
@NgModule({
  declarations: [
    ParticipantListComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [ParticipantListComponent]
})
export class SharedModule { }
