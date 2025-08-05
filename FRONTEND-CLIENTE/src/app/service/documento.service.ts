import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpHeaders,HttpClient,HttpErrorResponse,HttpParams } from '@angular/common/http';
import { Observable, throwError, catchError, shareReplay, take } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { interfaceDocumento } from '../interface/documento';
@Injectable({
  providedIn: 'root'
})
export class DocumentoService {
private url = environment.api;
sessionToken: string | null = sessionStorage.getItem('token');
cpf: any  = sessionStorage.getItem('cpf');
idcandidato: any = sessionStorage.getItem('codcand');

  constructor(private httpClient: HttpClient,@Inject(PLATFORM_ID) private platformId: Object) { }

deleteDocumento(valores: any,headers:any): Observable<interfaceDocumento> {
const idcandidato = valores.idcandidato || this.idcandidato;
const cpf = valores.cpf || this.cpf;
const nomeDocumento = valores.nomeDocumento; 
//const params = new HttpParams().set('idcandidato', idcandidato).set('cpf', cpf).set('nome', nomeDocumento);

const urlDelete = this.url + `/documento/${idcandidato}/${cpf}/${nomeDocumento}`;
console.log('URL Delete:', urlDelete);
    return this.httpClient.delete<any>(urlDelete, { headers }).
    pipe(take(1), catchError(this.handleError));
  }
  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro desconhecido';
    if (error.error instanceof ErrorEvent) {
      // Erro do cliente
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro do servidor
      errorMessage = `Código do erro: ${error.status}, mensagem: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
  getDocumento(idcandidato: string, cpf: string, headers?: HttpHeaders): Observable<interfaceDocumento[]> {
    const params = new HttpParams().set('idcandidato', idcandidato || this.idcandidato).set('cpf', cpf || this.cpf);
    return this.httpClient.get<interfaceDocumento[]>(this.url + '/documento', { params, headers })
      .pipe(take(1), catchError(this.handleError));
  }
}