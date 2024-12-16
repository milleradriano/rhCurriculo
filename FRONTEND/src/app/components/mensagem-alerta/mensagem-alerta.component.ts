import { Component,Inject } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
@Component({
  selector: 'app-mensagem-alerta',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent,MatButtonModule,MatDialogActions,MatDialogClose],
  templateUrl: './mensagem-alerta.component.html',
  styleUrl: './mensagem-alerta.component.css'
})
export class MensagemAlertaComponent {
constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
/* MODO DE USAR:
PARA UTILIZAR ESTE COMPONENTE DEVE IMPORTAR NO .TS
import { MenssagemAlertaComponent } from '../../component/menssagem-alerta/menssagem-alerta.component';
import { MatDialog } from '@angular/material/dialog';

constructor(
    
    public dialog: MatDialog
  ) {}

  openDialog() {
    const dialogRef = this.dialog.open(MenssagemAlertaComponent, {
      data: {
        tittle: 'Atenção',
        message: 'Por favor, informe a data de emissão do boleto',
        
      },
      height: '250px',
      width: '400px',
    });
  }
*/