import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, catchError, shareReplay } from 'rxjs';
import { environment } from '../../environments/environment';
import { Login } from '../interface/login';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  url = environment.api;
  constructor(private httpClient: HttpClient) {}
  postLogin(valores: any): Observable<Login> {
     console.log('valores', valores);
    return this.httpClient
      .post<Login>(this.url + '/login', valores)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let mensagemRetorno = '';
   

    mensagemRetorno = error.error.mensagem;
    if (error.error instanceof ErrorEvent) {

      console.error('ocorreu um de rede :', error.error);
    } else {
      //* este e o erro do servidor
      console.error('codigo do erro ', error.message);
      if (error.status === 0) {
        mensagemRetorno = 'Serviço indisponível';
      }
      if (error.status === 401) {
        mensagemRetorno = 'Usuário ou senha inválidos';      
      }
      if (error.status === 400) {
        mensagemRetorno = 'Dados inválidos';
      }
      if (error.status === 403) {
        mensagemRetorno = 'Usuário sem permissão';
      }
      if (error.status === 404) {
        mensagemRetorno = 'Página ou recurso não encontrado';
      }
      if (error.status === 500) {
        mensagemRetorno = 'Erro interno do servidor';
      }

      return throwError(() => mensagemRetorno);
    }
    // return an observable with a user-facing error message
    // retorno padrão caso nao seja catalogado
    return throwError(
      () => new Error('Algo deu errado; tente novamente mais tarde.')
    );
  }
}
