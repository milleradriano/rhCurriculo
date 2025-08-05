import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, take, throwError } from 'rxjs';
import { interfaceVaga, interfaceVagaCandidato } from '../interface/vaga';
@Injectable({
  providedIn: 'root'
})
export class VagaCandidatoService {
private url: string = environment.api;
  sessionToken: string | null = sessionStorage.getItem('token');

  constructor(private httpclient: HttpClient,@Inject(PLATFORM_ID) private platformId: Object) { }
  getVagaCandidato(codVaga: any, headers?: any):Observable<interfaceVaga> {
    if (!codVaga) {
      console.error('codVaga is null or undefined');
      return new Observable<interfaceVaga>();
    }
    return this.httpclient.get<interfaceVaga>(`${this.url}/vaga/${codVaga}`, { headers }).pipe(take(1), catchError(this.handleError)  );
  }

postVagaCandidato(vaga: any, headers?: any): Observable<any> {
  console.log('postVagaCandidato', vaga);
    if (!vaga) {
      console.error('Vaga is null or undefined');
      return new Observable<any>();
    }
    return this.httpclient.post<interfaceVagaCandidato>(`${this.url}/vaga-candidato`, vaga, { headers }).pipe(take(1), catchError(this.handleError));
  }

  deleteVagaCandidato(codVaga: any, headers?: any): Observable<any> {
    if (!codVaga) {
      console.error('codVaga is null or undefined');
      return new Observable<any>();
    }
    return this.httpclient.delete<any>(`${this.url}/vaga/${codVaga}`, { headers }).pipe(take(1), catchError(this.handleError));
  }

private handleError(error: HttpErrorResponse) {
  let errorMessage = 'Ocorreu um erro desconhecido';
  
  if (error.error instanceof ErrorEvent) {
    // Erro do cliente
    errorMessage = `Erro: ${error.error.message}`;
  } else {
    // Erro do servidor
    errorMessage = `Código do erro: ${error.status}, ` + 
                  `mensagem: ${error.message}`;
  }
  
  console.error(errorMessage);
  return throwError(() => new Error(errorMessage));
}
}
