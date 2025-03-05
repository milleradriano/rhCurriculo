import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError,catchError,shareReplay } from 'rxjs';
import { interfaceEmpresa} from '../interface/empresa';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class EmpresaService {
  private url= environment.api;
  constructor(private httpclient: HttpClient,@Inject(PLATFORM_ID) private platformId: Object,private httpClient: HttpClient) {}


  getEmpresa() {
    return this.httpClient
      .get<interfaceEmpresa[]>(this.url+"/empresa")
      .pipe(
        shareReplay(),
        catchError(this.handleError)
      );
  }
  getLogo() {
    return this.httpClient
      .get<interfaceEmpresa[]>(this.url+"/logo")
      .pipe(
        shareReplay(),
        catchError(this.handleError)
      );
  }
  postEmpresa(empresa: interfaceEmpresa): Observable<interfaceEmpresa> {
    return this.httpClient
      .post<interfaceEmpresa>(this.url+'/empresa', empresa)
      .pipe(shareReplay(1), catchError(this.handleError));
  }
  delempresa(idempresa: number): Observable<interfaceEmpresa> {
    return this.httpClient
      .delete<interfaceEmpresa>(this.url+"/empresa/"+idempresa)
      .pipe(shareReplay(1), catchError(this.handleError));
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
