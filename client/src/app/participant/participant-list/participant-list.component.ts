import {Component, OnInit} from '@angular/core';
import {Participant} from '../participant.model';

@Component({
  selector: 'app-participant-list',
  templateUrl: './participant-list.component.html',
  styleUrls: ['./participant-list.component.css']
})
export class ParticipantListComponent implements OnInit {
  participants: Participant[] = [
    new Participant(
      'Willy',
      'Nzesseu',
      '21/06/1997',
      'willynzesseu@gmail.com',
      '0635348819',
      'Safi',
      'Cameroon',
      4,
      4,
      'TPV-SAFI',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=573ea9160fba276fabd3fc96fad4944b&auto=format&fit=crop&w=1072&q=80'
    ),new Participant(
      'Paul',
      'Jean',
      '21/06/1997',
      'paul@gmail.com',
      '0635348819',
      'Fès',
      'Senegal',
      4,
      4,
      'Paroisse Saint Francois d\'Assise',
      'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?ixlib=rb-0.3.5&s=e3e35cee33a6cc4f669ed08442ab1cca&auto=format&fit=crop&w=1051&q=80'
    ),
    new Participant(
      'Francis',
      'Yemetio',
      '11/06/1996',
      'leroifrancis56@gmail.com',
      '0635348819',
      'Casablanca',
      'Mali',
      2,
      3,
      'EEAM-Casablanca',
      'https://images.unsplash.com/photo-1507101105822-7472b28e22ac?ixlib=rb-0.3.5&s=92caf7e0bf50c687ad3a7bece76b11b4&auto=format&fit=crop&w=1052&q=80')
  ];

  constructor() {
  }

  ngOnInit() {
  }

}
