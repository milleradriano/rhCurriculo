import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { interfaceVaga } from '../interface/vaga'; // corrigido o nome
import { Observable, shareReplay, throwError } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { environment } from '../../environments/environment.prod';
import { HadleErrorGlobalService } from './handle-error-global.service';
import { error } from 'console';

@Injectable({
  providedIn: 'root'
})
export class PainelVagaService {
  constructor(
    private httpClient: HttpClient,
    private handleError: HadleErrorGlobalService,
    
  ) { }
  private url = environment.api + '/painelvaga';
  getCarregaPainelVaga(): Observable<interfaceVaga[]> {
    return this.httpClient
      .get<interfaceVaga[]>(this.url)
      .pipe(take(1), catchError(error => this.handleError.handleError(error)));
  }
  
}
export function handleError(error: HttpErrorResponse) {
  if (error.error instanceof ErrorEvent) {
    // A client-side ou um erro de rede ocorreu.
    console.error('Ocorreu um erro:', error.error.message);
  } else {
    // O backend retornou um código de resposta não bem-sucedido.
    console.error(
      `Backend retornou o código ${error.status}, ` +
      `body era: ${error.error}`);
  }
  // Retorne um observable com uma mensagem de erro amigável ao usuário.
  return throwError(() => new Error('Algo ruim aconteceu; por favor, tente novamente mais tarde.'));
}