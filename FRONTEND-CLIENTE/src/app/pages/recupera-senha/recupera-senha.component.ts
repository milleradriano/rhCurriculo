import { Component, inject } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MenuComponent } from '../menu/menu.component';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RadioButtonClickEvent, RadioButtonModule } from 'primeng/radiobutton';
import { DropdownModule } from 'primeng/dropdown';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { InputMaskModule } from 'primeng/inputmask';
import { FormatacpfDirective } from '../../diretiva/formatacpf.directive';
import { ObservacaobottonComponent } from '../../components/observacaobotton/observacaobotton.component';
import { ApenasNumeroDirective } from '../../diretiva/apenasnumero.directive';
import { FormatatelefoneDirective } from '../../diretiva/formatatelefone.directive';
import { UploaddocumentoComponent } from '../../components/uploaddocumento/uploaddocumento.component';
import { SessionstorageService } from '../../service/sessionlstorage.service';
import { MensagemAlertaComponent } from '../../components/mensagem-alerta/mensagem-alerta.component';
import { ToastComponent } from '../../components/toast/toast.component';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-recupera-senha',
  standalone: true,
 imports: [
     MatGridListModule,
     MatMenuModule,
     MatIconModule,
     MatButtonModule,
     MatCardModule,
     InputTextModule,
     FormsModule,
     CommonModule,
     RadioButtonModule,
     DropdownModule,
     ReactiveFormsModule,
     ButtonModule,
     FileUploadModule,
     ToastModule,
     InputMaskModule,
     FormatacpfDirective,  
     ToastComponent,
     PasswordModule     
   ],
  templateUrl: './recupera-senha.component.html',
  styleUrl: './recupera-senha.component.css'
})
export class RecuperaSenhaComponent {
  constructor(
    private formBuilder: FormBuilder
  ) { }
  recuperarSenhaForm = this.formBuilder.group({
    email:[
      '',
      [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ],
    ],
  })
    recuperarSenha() {
  throw new Error('Method not implemented.');
  }  
}
