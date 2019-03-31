import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import { Observable, throwError, Subject } from 'rxjs';
import { catchError} from 'rxjs/operators';
import {API_URL} from '../../config/apiConfig';
import {HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  fetchData(): Observable<HttpResponse<any>> {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token').trim());

    return this.http.get<any>(API_URL + '/clients/' + localStorage.getItem('id'), {headers: headers, observe: 'response'})
                    .pipe(
                         catchError(this.errorHandler)
                    );

  }

  private errorHandler(error: HttpErrorResponse) {
    return throwError(error);
  }
}
