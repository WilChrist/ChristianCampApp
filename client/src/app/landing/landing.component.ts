import { Component, OnInit } from '@angular/core';
import {PreloadService} from '../services/preload/preload.service';
@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  constructor(private preloadService:PreloadService) { }

  ngOnInit() {
   //this.preloadService.showPreloader();
    
   this.preloadService.hidePreloader();
  }

}
