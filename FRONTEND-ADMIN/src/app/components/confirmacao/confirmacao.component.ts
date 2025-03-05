import { Component, Injectable } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-confirmacao',
  standalone: true,
  imports: [ConfirmDialogModule, ToastModule, ButtonModule],
  //providers: [ConfirmationService, MessageService],

  templateUrl: './confirmacao.component.html',
  styleUrl: './confirmacao.component.css'
})

@Injectable({ providedIn: 'root' })
export class ConfirmacaoComponent {

  constructor(private confirmationService: ConfirmationService, private messageService: MessageService) {}
confirmaExclusao(message: string, acceptCallback: () => void) {
    this.confirmationService.confirm({       
        message: 'Deseja remover?',
        header: 'Confirma Exclusão ',
        icon: 'pi pi-info-circle',
        acceptButtonStyleClass:"p-button-danger p-button-text",
        acceptLabel:"Sim",
        rejectButtonStyleClass:"p-button-text p-button-text",
        rejectLabel:"Não",
        acceptIcon:"none",
        rejectIcon:"none",
        defaultFocus: 'reject',

        accept: acceptCallback
       
   });
}

}
