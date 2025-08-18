import { Inject, Injectable, OnInit, PLATFORM_ID } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Observable, throwError, catchError, shareReplay, take } from 'rxjs';
import { interfaceResidencia, interfaceCep } from '../interface/residencia';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class ResidenciaService {
  private url = environment.api;
  sessionToken: string | null = sessionStorage.getItem('token');
  cpf: any = sessionStorage.getItem('cpf');
  idcandidato: any = sessionStorage.getItem('codcand');
  constructor(
    private httpclient: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  getCep(cep: any, headers?: any): Observable<interfaceCep[]> {
    console.log('cep no get', cep);
    const params = new HttpParams().set('cep', cep);
    return this.httpclient
      .get<interfaceCep[]>(`${this.url}/cep/${cep}`, { params, headers })
      .pipe(take(1), catchError(this.handleError));
  }

  /*************  ✨ Windsurf Command 🌟  *************/
  getResidencia(valor: any, headers?: any): Observable<interfaceResidencia[]> {
    console.log('residencia no servi', valor.idcandidato, valor.cpf);
    const valores = new HttpParams().set('idcandidato', valor.idcandidato || this.idcandidato)
      .set('cpf', valor.cpf || this.cpf);
    return this.httpclient
      .get<interfaceResidencia[]>(this.url + '/residencia', { params: valores, headers })
      .pipe(take(1), catchError(this.handleError));
  }

  postResidencia(valores: any, headers?: any): Observable<interfaceResidencia> {
    console.log('cpf service', typeof valores);
    return this.httpclient
      .post<interfaceResidencia>(this.url + '/residencia', valores, { headers })
      .pipe(take(1), catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro desconhecido';

    if (error.error instanceof ErrorEvent) {
      // Erro do cliente
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro do servidor
      errorMessage =
        `Código do erro: ${error.status}, ` + `mensagem: ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
