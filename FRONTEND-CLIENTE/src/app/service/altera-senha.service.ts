import { Injectable,Inject,PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError,catchError, take } from 'rxjs';

import { interfacealteraSenha } from '../interface/alteraSenha';
import { environment } from '../../environments/environment.prod';
import { SessionStorageService } from './sessionlstorage.service';

@Injectable({
  providedIn: 'root'
})
export class AlteraSenhaService {

  private url = environment.api;

  constructor(private httpclient: HttpClient,@Inject(PLATFORM_ID) private platformId: Object) { }
  
  idcandidato: string | null = sessionStorage.getItem('codcand');
  cpf : string  | null = sessionStorage.getItem('cpf');

  putAlteraSenha(valores: any, headers?: any): Observable<interfacealteraSenha> {
    valores = {idcandidato: this.idcandidato, cpf: this.cpf,...valores };
    console.log('cpf service', valores);   
    return this.httpclient.post<interfacealteraSenha>(this.url + '/altera-senha', 
      valores, { headers }).
    pipe(take(1), catchError(this.handleError));
    // this.httpclient.put<interfacealteraSenha>(this.url + '/altera-senha', valores)
  }

  private handleError(error: HttpErrorResponse) {
    let mensagemRetorno = '';
    console.log('error', error?.error?.mensagem || error.error.message);

    mensagemRetorno = error.error.mensagem;
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
   
      mensagemRetorno = 'Erro de rede, tente novamente mais tarde.';
    } else {
      //* este e o erro do servidor
     
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

      if (error.status === 419) {
        mensagemRetorno = 'Data de emissão incorreta';
      }

      if (error.status === 500) {
        mensagemRetorno = 'Erro interno do servidor';
      }

      return throwError(() =>mensagemRetorno);
    }
    // return an observable with a user-facing error message
    // retorno padrão caso nao seja catalogado
    return throwError(
      () => mensagemRetorno
    );
  }
}
