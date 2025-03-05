Para usar o componente voce deve:
1º deve-se incluir na pagina que deseja usar:
import { ConfirmacaoComponent } from '../../component/confirmacao/confirmacao.component';

imports:[ConfirmacaoComponent]

 providers: [ConfirmacaoComponent],

 constructor(
  private confirmacao: ConfirmacaoComponent
  
 )

2º Dentro da função que vai deletar o registro deve-se usar no inicio:
   
   this.confirmacao.confirmaExclusao1('Você tem certeza que deseja excluir este item?', () => { 
   
     ...restante do codigo
   
   })

3º Dentro do html da page que deseja utilizar adicionar o componente:

          <app-confirmacao></app-confirmacao>


4º No app.config.ts adicionar os seguintes itens:

....inicio das importações
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { HttpClient, HttpClientModule,provideHttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration(), provideAnimationsAsync(), provideHttpClient(),BrowserAnimationsModule,
     BrowserModule, MessageService,ConfirmationService ,ConfirmDialogModule, ToastModule, HttpClientModule,CommonModule],
     
}


