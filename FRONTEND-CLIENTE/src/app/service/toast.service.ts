import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private messageService: MessageService) { }

  sucesso(message: string) {
    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: message });
  }

  erro(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Erro', detail: message });
  }

  info(message: string) {
    this.messageService.add({ severity: 'info', summary: 'Info', detail: message });
  }

  atencao(message: string) {
    this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: message });
  }
  clear() {
    this.messageService.clear();
  }
}

