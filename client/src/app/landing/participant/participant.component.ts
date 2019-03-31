import { Component, OnInit } from '@angular/core';
import {DataService} from '../../services/data/data.service';

@Component({
  selector: 'app-participant',
  templateUrl: './participant.component.html',
  styleUrls: ['./participant.component.css']
})
export class ParticipantComponent implements OnInit {

  constructor(private dataService:DataService) { }

  ngOnInit() {
  }

  /*signIn() {
    this.hideError();
    this.loginService.signIn(this.login, this.password).subscribe(
      (data: HttpResponse<any>) => this.successHandler(data),
      (error: HttpErrorResponse) => this.errorHandler(error)
    );
  }

  errorHandler(error: HttpErrorResponse) {
    this.login = '';
    this.password = '';
    if (error.status !== 403) {
      this.showError(`can't reach the server`);
    } else {
      this.showError(`wrong login/password`);
    }
}

successHandler(data: HttpResponse<any>) {
  const token = data.headers.get('Authorization').split(' ')[1];
  const id = data.body.pk;
  this.loginService.login(token, id);
}*/
}
