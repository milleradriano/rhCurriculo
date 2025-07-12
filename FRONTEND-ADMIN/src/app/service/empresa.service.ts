import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, catchError,  take } from 'rxjs';
import { interfaceEmpresa } from '../interface/empresa';
import { environment } from '../../environments/environment.prod';
import {HadleErrorGlobalService} from './handle-error-global.service'
@Injectable({
  providedIn: 'root',
})
export class EmpresaService {
  private url = environment.api;
  constructor(
    private httpclient: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private httpClient: HttpClient,
    private handleError: HadleErrorGlobalService
  ) {}

  getEmpresa() {
    return this.httpClient
      .get<interfaceEmpresa[]>(this.url + '/empresa')
      .pipe(take(1), catchError(error => this.handleError.handleError(error)));
  }
  getLogo() {
    return this.httpClient
      .get<interfaceEmpresa[]>(this.url + '/logo')
      .pipe(take(1), catchError(error => this.handleError.handleError(error)));
  }
  postEmpresa(empresa: interfaceEmpresa): Observable<interfaceEmpresa> {
    console.log('valor post empresa', empresa);
    return this.httpClient
      .post<interfaceEmpresa>(this.url + '/empresa', empresa)
      .pipe(take(1), catchError(error => this.handleError.handleError(error)));
  }
  delempresa(idempresa: number): Observable<interfaceEmpresa> {
    return this.httpClient
      .delete<interfaceEmpresa>(this.url + '/empresa/' + idempresa)
      .pipe(take(1), catchError(error => this.handleError.handleError(error)));
  }

// private handleError(error: HttpErrorResponse) {
//   let mensagemRetorno = '';

//   // 🔴 Erro de rede: sem conexão com o servidor
//   if (error.status === 0) {
   
//     mensagemRetorno = 'Sem conexão com o servidor. Verifique sua internet ou tente mais tarde.';
//   } else {
//     // 🔁 Mensagem personalizada enviada pelo backend (se existir)
//     if (error.error?.mensagem) {
//       mensagemRetorno = error.error.mensagem;
//     }
  

//     // 🧠 Tratamento por código HTTP
//     switch (error.status) {
//       case 400:
//         mensagemRetorno ||= 'Parâmetros inválidos';
//         break;
//       case 401:
//         mensagemRetorno ||= 'Usuário ou senha inválidos';
//         break;
//       case 403:
//         mensagemRetorno ||= 'Usuário sem permissão';
//         break;
//       case 404:
//         mensagemRetorno ||= 'Página ou recurso não encontrado';
//         break;
//       case 419:
//         mensagemRetorno ||= 'Data de emissão incorreta';
//         break;
//       case 500:
//         mensagemRetorno ||= 'Erro interno do servidor';
//         break;
//     }
//   }

//   // 🔙 Retorna o erro tratado
//   return throwError(() => mensagemRetorno);
// }


/*******  242b7383-1847-415b-ad92-005f77f12a75  *******/  
}