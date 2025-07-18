import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { interfaceVaga } from '../interface/vaga'; // corrigido o nome
import { Observable, shareReplay, throwError } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { environment } from '../../environments/environment.prod';
import { HadleErrorGlobalService } from './handle-error-global.service';
import { error } from 'console';
@Injectable({
  providedIn: 'root',
})
export class VagasService {
  constructor(
    private httpClient: HttpClient,
    private handleError: HadleErrorGlobalService
  ) {}
  private url = environment.api + '/vaga';

  getVaga(): Observable<interfaceVaga[]> {
    return this.httpClient
      .get<interfaceVaga[]>(this.url)
      .pipe(take(1), catchError(error => this.handleError.handleError(error)));
  }
  postVaga(vaga: interfaceVaga): Observable<interfaceVaga> {
    console.log(vaga);
    return this.httpClient
      .post<interfaceVaga>(this.url, vaga)
      .pipe(take(1), catchError(error => this.handleError.handleError(error)));
  }

 
}
