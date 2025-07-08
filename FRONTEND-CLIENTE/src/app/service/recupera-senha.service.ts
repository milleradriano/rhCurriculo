import { Inject,Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
@Injectable({
  providedIn: 'root'

})
export class RecuperaSenhaService {
  private url = environment.api;
  constructor(private http: HttpClient,@Inject(PLATFORM_ID) private platformId: Object) { }

postEmailRecuperaSenha(cpf: string, email: string) {
  const params = new HttpParams().set('cpf', cpf).set('email', email);
  return this.http.post<any>(`${this.url}/recuperar-senha`, params);
}
}