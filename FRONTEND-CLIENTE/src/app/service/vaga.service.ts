import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, take } from 'rxjs';
import { interfaceVaga } from '../interface/vaga';
@Injectable({
  providedIn: 'root'
})
export class VagaService {
private url: string = environment.api;
  sessionToken: string | null = sessionStorage.getItem('token');

  constructor(private httpclient: HttpClient,@Inject(PLATFORM_ID) private platformId: Object) { }
  getVaga(codVaga: any, headers?: any):Observable<interfaceVaga> {
    if (!codVaga) {
      console.error('codVaga is null or undefined');
      return new Observable<interfaceVaga>();
    }
    return this.httpclient.get<interfaceVaga>(`${this.url}/vaga/${codVaga}`, { headers }).pipe(take(1), catchError(this.handleError)  );
  }
  private handleError(error: any): Observable<never> {
    let errorMessage = 'Ocorreu um erro desconhecido';
    if (error.error instanceof ErrorEvent) {
      // Erro do cliente
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro do servidor
      errorMessage = `Código do erro: ${error.status}, mensagem: ${error.message}`;
    }
    console.error('Erro:', errorMessage);
    return new Observable<never>();
  }
}

