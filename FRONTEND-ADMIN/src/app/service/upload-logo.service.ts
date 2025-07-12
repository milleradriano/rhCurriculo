import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError,catchError,shareReplay, take } from 'rxjs';
import { interfaceLogo} from '../interface/uploadLogo';
import { environment } from '../../environments/environment.prod';
import { SessionStorageService } from './sessionStorage.service';
import { HadleErrorGlobalService } from './handle-error-global.service';
@Injectable({
  providedIn: 'root'
})
export class UploadLogoService {
 constructor(
    private httpClient: HttpClient,
    private sessionStorage: SessionStorageService,
    private handleError: HadleErrorGlobalService
  ) {}

  uploadLogo(files: File[], headers?: any): Observable<any> {
    const formData = new FormData(); 
    // Itera pelos arquivos e adiciona individualmente no FormDatacon
    console.log('formData', formData);

    files.forEach((file) => {
      formData.append('logo', file, file.name); // 'logo' deve ser o nome esperado pelo backend
      console.log('formData no foreach', file.name);
    }
  )
    // Envia o FormData para a API
    return this.httpClient
      .post(`${environment.api}/uploadlogo`, formData, { headers})
      .pipe(catchError(error => this.handleError.handleError(error)));
  }
  
}