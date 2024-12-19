import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError,catchError,shareReplay } from 'rxjs';
import { interfaceResidencia,interfaceCep} from '../interface/residencia';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ResidenciaService {
  private url = environment.api
  constructor(private httpclient: HttpClient,@Inject(PLATFORM_ID) private platformId: Object,private httpClient: HttpClient) { }

getCep(cep: string): Observable<interfaceCep> {
  return this.httpclient
    .get<interfaceCep>(this.url+'/cep/?cep='+cep)
    .pipe(shareReplay(1), catchError(this.handleError));    

}


getResidencia(valores: any): Observable<interfaceResidencia> {
  return this.httpclient
    .get<interfaceResidencia>(this.url+'/residencia')
    .pipe(shareReplay(1), catchError(this.handleError));
}


postResidencia(valores: any): Observable<interfaceResidencia> {
  return this.httpclient
    .post<interfaceResidencia>(this.url+'/cep', valores)
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