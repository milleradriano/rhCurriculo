import { Injectable } from '@angular/core';
import { HttpClient,HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HadleErrorGlobalService {

  constructor(private httpClient: HttpClient) { }
 handleError(error: HttpErrorResponse) {
  let mensagemRetorno = '';

  // 🔴 Erro de rede: sem conexão com o servidor
  if (error.status === 0) {
   
    mensagemRetorno = 'Sem conexão com o servidor. Verifique sua internet ou tente mais tarde.';
  } else {
    // 🔁 Mensagem personalizada enviada pelo backend (se existir)
    if (error.error?.mensagem) {
      mensagemRetorno = error.error.mensagem;
    }
  

    // 🧠 Tratamento por código HTTP
    switch (error.status) {
      case 400:
        mensagemRetorno ||= 'Parâmetros inválidos';
        break;
      case 401:
        mensagemRetorno ||= 'Usuário ou senha inválidos';
        break;
      case 403:
        mensagemRetorno ||= 'Usuário sem permissão';
        break;
      case 404:
        mensagemRetorno ||= 'Página ou recurso não encontrado';
        break;
      case 419:
        mensagemRetorno ||= 'Data de emissão incorreta';
        break;
      case 500:
        mensagemRetorno ||= 'Erro interno do servidor';
        break;
    }
  }

  // 🔙 Retorna o erro tratado
  return throwError(() => mensagemRetorno);
}

}
