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

import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { InputMaskModule } from 'primeng/inputmask';
import { FormatacpfDirective } from '../../diretiva/formatacpf.directive';
import { PasswordModule } from 'primeng/password';
import { RecuperaSenhaService } from '../../service/recupera-senha.service';
import { ToastService } from '../../service/toast.service';
import { SessionStorageService } from '../../service/sessionlstorage.service';
import { HttpHeaders } from '@angular/common/http';
import { LoadingComponent } from '../../components/loading/loading.component';

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
    PasswordModule,
    LoadingComponent
],
  templateUrl: './recupera-senha.component.html',
  styleUrl: './recupera-senha.component.css',
})
export class RecuperaSenhaComponent {
  sessionToken: string | null = this.sessionStorage.getLogin('token');
  loading: boolean= false;
  constructor(
    private formBuilder: FormBuilder,
    private recuperarSenha: RecuperaSenhaService,
    private mensagem: ToastService,
       private sessionStorage: SessionStorageService,
  ) {}
    headers = new HttpHeaders({ Authorization: `Bearer ${this.sessionToken}` });
  recuperarSenhaForm = this.formBuilder.group({
    cpf: ['', [Validators.required, Validators.minLength(14), Validators.maxLength(14)]],
    email: [
      '',
      [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ],
    ],    
  });
  recuperaSenha(valores: any) {
    console.log('Recuperar Senha Valores:', valores);
    if (this.recuperarSenhaForm.invalid) {
      this.mensagem.erro('Por favor, preencha todos os campos corretamente.');
      return;
    }
    this.loading = true;
    const cpf:any = valores.cpf;
    const email:any = valores.email;
    this.recuperarSenha.putEmailRecuperaSenha( cpf, email ).subscribe({
      next: (response) => {
        console.log('Recuperar Senha Response:', response);
         this.loading = false;
        this.mensagem.sucesso('E-mail enviado, verfique seu e-mail.');
      },
      error: (error) => {
        console.error('Recuperar Senha Error:', error);
        this.mensagem.erro(error.error.mensagem || 'Erro ao enviar e-mail de recuperação.');
      },
    });
  }
}
