import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, catchError } from 'rxjs';

import { environment } from '../../environments/environment';
import { SessionStorageService } from './sessionlstorage.service';

@Injectable({
  providedIn: 'root',
})
export class UploadLogoService {
  constructor(
    private httpClient: HttpClient,
    private sessionStorage: SessionStorageService
  ) {}
  cpf: string | null = this.sessionStorage.getLogin('cpf');
  uploadDocumento(files: File[], headers?: any): Observable<any> {
    const formData = new FormData();
    const idcandidato: string | null = this.sessionStorage.getLogin('codcand');
    const cpf: string | null = this.sessionStorage.getLogin('cpf');
    if(!idcandidato) {
      return throwError(() =>new Error('Candidato não encontrado no sessionStorage'));
    }
    formData.append('idcandidato', idcandidato || '');
    formData.append('cpf', cpf || '');
    // Itera pelos arquivos e adiciona individualmente no FormData
    files.forEach((file) => {
      formData.append('documento', file, file.name); // 'logo' deve ser o nome esperado pelo backend
    });

    // Envia o FormData para a API
    return this.httpClient
      .post(`${environment.api}/uploaddocumento`, formData, { headers})
      .pipe(catchError(this.handleError));
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
    return throwError(() => new Error(errorMessage));
  }
}
