import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { interfaceVaga } from '../interface/vaga'; // corrigido o nome
import { Observable, shareReplay, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment.prod';
@Injectable({
  providedIn: 'root',
})
export class VagasService {
  private readonly url = environment.api; // REMOVER 

  constructor(private httpClient: HttpClient) {}

  getVagas(): Observable<interfaceVaga[]> {
    return this.httpClient
      .get<interfaceVaga[]>(this.url+'/vagas')
      .pipe(catchError(this.handleError)
      );
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