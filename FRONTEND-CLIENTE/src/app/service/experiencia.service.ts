import { Injectable,Inject,PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError,catchError, take } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { interfaceExperiencia } from '../interface/experiencia';

@Injectable({
  providedIn: 'root'
})
export class ExperienciaService {
  private url = environment.api
  sessionToken: string | null = sessionStorage.getItem('token'); 
  cpf: any  = sessionStorage.getItem('cpf');
  idcandidato: any = sessionStorage.getItem('idcand');
  constructor(private httpclient: HttpClient,@Inject(PLATFORM_ID) private platformId: Object) { }
  
  getExperiencia(valor:any, headers?: any): Observable<[interfaceExperiencia]> {
    console.log('experiencia no servi', valor.idcandidato, valor.cpf);
    const valores = { valor };
    const params = new HttpParams()
      .set('idcandidato', valor.idcandidato || this.idcandidato)
      .set('cpf', valor.cpf || this.cpf);
    // ESSE GET ESTA COMO POST  .post<[interfaceExperiencia]> PQ ESTOU ENVIANDO CPF NO BODY
    // CASO NAO FOSSE NO BOBY SERIA POR PARAMETRO E USARIA GET
    return this.httpclient
      .get<[interfaceExperiencia]>(this.url + '/experiencia', {params,  headers })
      .pipe(take(1), catchError(this.handleError));
  }
  postExperiencia(valores: any, headers?: any): Observable<interfaceExperiencia> {
    console.log('cpf service', valores)   
    return this.httpclient
      .post<interfaceExperiencia>(this.url + '/experiencia', valores, { headers })
      .pipe(take(1), catchError(this.handleError));
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
    
    return throwError(() => new Error(errorMessage));
  }
}

