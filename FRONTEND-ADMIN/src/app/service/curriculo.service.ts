import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, catchError, shareReplay } from 'rxjs';
import { interfaceCurriculo } from '../interface/curriculo';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CurriculoService {
  private url= environment.api;
  constructor(
    private httpclient: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private httpClient: HttpClient
  ) {}
  getCurriculo(): Observable<interfaceCurriculo[]> {
    return this.httpclient
      .get<interfaceCurriculo[]>(this.url + '/curriculo')
      .pipe(shareReplay(1), catchError(this.handleError));
  }
  postCurriculo(valores: any): Observable<interfaceCurriculo> {
    return this.httpclient
      .post<interfaceCurriculo>(this.url+'/curriculo', valores)
      .pipe(shareReplay(1), catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
          `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
