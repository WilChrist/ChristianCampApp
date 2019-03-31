import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PreloadService {

  constructor() { }

  showPreloader(){
    document.getElementById("globalPreloader").style.display="block";
  }

  hidePreloader(){
    document.getElementById("globalPreloader").style.display="none";
  }
}
