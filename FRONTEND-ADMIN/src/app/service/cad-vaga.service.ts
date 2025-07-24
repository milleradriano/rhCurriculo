import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { interfaceVaga } from '../interface/vaga'; // corrigido o nome
import { Observable, shareReplay, throwError } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { environment } from '../../environments/environment.prod';
import { HadleErrorGlobalService } from './handle-error-global.service';
import { error } from 'console';
@Injectable({
  providedIn: 'root',
})
export class PainelVagasService {
  constructor(
    private httpClient: HttpClient,
    private handleError: HadleErrorGlobalService
  ) {}
  private url = environment.api + '/vaga';

 
}
