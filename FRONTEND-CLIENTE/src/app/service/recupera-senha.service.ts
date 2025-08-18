import { Inject,Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { catchError, Observable, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'

})
export class RecuperaSenhaService {
  private url = environment.api;
  constructor(private http: HttpClient,@Inject(PLATFORM_ID) private platformId: Object) { }

postEmailRecuperaSenha(cpf: string, email: string): Observable<any> {
  const params = new HttpParams().set('cpf', cpf).set('email', email);
  return this.http.post<any>(`${this.url}/recuperar-senha`, params).pipe(
    catchError(this.handleError)
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

