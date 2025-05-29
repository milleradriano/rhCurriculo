import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError, catchError, shareReplay, take } from 'rxjs';
import { interfaceCurriculo } from '../interface/curriculo';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class CurriculoService {
  private url= environment.api;
  constructor(
    private httpclient: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
  
  ) {

  }
  getCurriculo(cpf: string, headers?: any): Observable<interfaceCurriculo[]> {
    console.log('cpf', cpf);
    const params = new HttpParams().set('cpf', cpf); // Constrói a URL corretamente
    return this.httpclient
      .get<interfaceCurriculo[]>(this.url + '/curriculo', { params, headers })
      .pipe(
       take(1), 
        catchError(this.handleError)
      );
  }
  
  postCurriculo(valores: string, headers?: any): Observable<interfaceCurriculo> {
   
    return this.httpclient
      .post<interfaceCurriculo>(this.url + '/curriculo', valores, { headers })
      .pipe(
       take(1),
        catchError(this.handleError)
      );   
  }

  private handleError(error: HttpErrorResponse) {
    let mensagemRetorno = '';
    console.log('error', error.error.mensagem);

    mensagemRetorno = error.error.mensagem;
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('ocorreu um de rede :', error.error);
    } else {
      //* este e o erro do servidor
      console.error('codigo do erro ', error.status);
      if (error.status === 0) {
        mensagemRetorno = 'Serviço indisponível';
      }
      if (error.status === 401) {
        mensagemRetorno = 'Usuário ou senha inválidos';
      }
      if (error.status === 400) {
        mensagemRetorno = 'Parâmetros inválidos';
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

      return throwError(() => new Error(mensagemRetorno));
    }
    // return an observable with a user-facing error message
    // retorno padrão caso nao seja catalogado
    return throwError(
      () => new Error('Algo deu errado; tente novamente mais tarde.')
    );
  }
}
