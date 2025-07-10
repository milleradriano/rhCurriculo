import { Component, inject, OnInit } from '@angular/core';
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

import { ApenasNumeroDirective } from '../../diretiva/apenasnumero.directive';
import { FormatatelefoneDirective } from '../../diretiva/formatatelefone.directive';

import { SessionStorageService } from '../../service/sessionlstorage.service';
import { MensagemAlertaComponent } from '../../components/mensagem-alerta/mensagem-alerta.component';

import { PasswordModule } from 'primeng/password';
import { RecuperaSenhaComponent } from '../recupera-senha/recupera-senha.component';
import {
  DialogService,
  DynamicDialogModule,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';

import { DividerModule } from 'primeng/divider';
import { DialogModule } from 'primeng/dialog';
import { LoadingComponent } from '../../components/loading/loading.component';
import { LoginService } from '../../service/login.service';

import { Router } from '@angular/router';
import { ToastService } from '../../service/toast.service';
import { ProgressbarComponent } from '../../components/progressbar/progressbar.component';
import { AlteraSenhaService } from '../../service/altera-senha.service';
import { HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-altera-senha',
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
    PasswordModule,
    DynamicDialogModule,
    DialogModule,
    LoadingComponent,
    ProgressbarComponent,
    DividerModule,
  ],
  templateUrl: './altera-senha.component.html',
  styleUrl: './altera-senha.component.css',
})
export class AlteraSenhaComponent {
  loading: boolean = false;
  showProgress: boolean = false;
  sessionToken: string | null = this.sessionStorage.getLogin('token');
  headers = new HttpHeaders({ Authorization: `Bearer ${this.sessionToken}` });
  constructor(
    private formBuilder: FormBuilder,
    private toast: ToastService,
    private sessionStorage: SessionStorageService,
    private alteraSenhaService: AlteraSenhaService
  ) {}
 alteraSenhaForm = this.formBuilder.group({
    novaSenha: ['', Validators.required],
    confirmaSenha: ['', Validators.required],
  });

/*************  ✨ Windsurf Command 🌟  *************/
  postAlteraSenha({ novaSenha, confirmaSenha }: { novaSenha: string; confirmaSenha: string }) {
    if (novaSenha !== confirmaSenha) {

      this.toast.erro('As senhas devem ser iguais.');
      return;
    }
    this.alteraSenhaService.putAlteraSenha({ novaSenha: novaSenha, confirmaSenha:confirmaSenha },this.headers)
      .subscribe({
        next: () => this.toast.sucesso('Senha alterada com sucesso!'),

        error: (error) => this.toast.erro(error),
      });
  
  }

}
