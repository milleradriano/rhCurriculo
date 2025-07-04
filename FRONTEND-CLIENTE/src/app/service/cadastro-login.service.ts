import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, catchError, shareReplay } from 'rxjs';
import { interfaceCurriculo } from '../interface/curriculo';
import { environment } from '../../environments/environment';
import { interfaceCadastraLogin } from '../interface/cadastraLogin';
import { firstValueFrom } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CadastroLoginService {
private url= environment.api;
  constructor(
    private httpclient: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { 

  }  
 postCadastroLogin(valores: any): Observable<interfaceCadastraLogin> {
    return this.httpclient
      .post<interfaceCadastraLogin>(this.url+'/cadastro-login', valores)
      .pipe(shareReplay(1), catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('Ocorreu um erro:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Erro: ${error.status}, ` +
          `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError(() => new Error('Algo deu errado; tente novamente mais tarde.'));
  }

}
