Utilizado TOAST

1º CRIAR UM SERVICE 
# COLAR import { Injectable } from '@angular/core';
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
    this.messageService.add({ severity: 'error', summary: 'Atenção', detail: message });
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

2º NO APP.CONFIG.TS ADICIONAR 
import { ToastModule } from 'primeng/toast';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
EXEMPLO DE EXPORT: 
export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration(), provideAnimationsAsync(), provideHttpClient(),BrowserAnimationsModule,BrowserModule,
    MessageService,ConfirmationService ,ConfirmDialogModule, ToastModule,ToastModule, HttpClientModule,CommonModule, provideAnimationsAsync(), provideAnimationsAsync(), provideAnimationsAsync(), provideAnimationsAsync(), provideAnimationsAsync(), provideAnimationsAsync(), provideAnimationsAsync(), provideAnimationsAsync(), provideAnimationsAsync(), provideAnimationsAsync()],
};

3º NO APP.COMPONENT.HTML
<div class="conteudo">
  <!-- <app-vagas></app-vagas>   -->
<p-toast  position="top-right"></p-toast>
  <router-outlet></router-outlet> 
   
 </div>

 