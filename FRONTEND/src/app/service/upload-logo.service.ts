import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError,catchError,shareReplay } from 'rxjs';
import { interfaceLogo} from '../interface/uploadLogo';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadLogoService {

  constructor(private httpClient: HttpClient) {  }


  uploadlogo(files: File[]): Observable<any> {
    const formData = new FormData();
  
    // Itera pelos arquivos e adiciona individualmente no FormData
    files.forEach((file) => {    
      formData.append('logo', file, file.name); // 'logo' deve ser o nome esperado pelo backend
    });
  
    // Envia o FormData para a API
    return this.httpClient.post(`${environment.api}/uploadLogo`, formData);
  }
}