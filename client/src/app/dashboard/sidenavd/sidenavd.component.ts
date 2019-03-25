import { Component, OnInit } from '@angular/core';
import {Participant} from '../../participant/participant.model';

@Component({
  selector: 'dashboard-sidenavd',
  templateUrl: './sidenavd.component.html',
  styleUrls: ['./sidenavd.component.css']
})
export class SidenavdComponent implements OnInit {
  admin: Participant = new Participant(
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
    'https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-0.3.5&s=e69f882a61d4a5510e5c8dc09f42c8a1&auto=format&fit=crop&w=800&q=80'
  );
  constructor() { }

  ngOnInit() {
  }

}
