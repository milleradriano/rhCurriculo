import { Component, inject, Input, input } from '@angular/core';
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
import { LocalstorageService } from '../../service/localstorage.service';
import { ToastComponent } from '../../components/toast/toast.component';
import { CurriculoService } from '../../service/curriculo.service';
import { InputreadonlyDirective } from '../../diretiva/inputreadonly.directive';
import { InputpreenchidoDirective } from '../../diretiva/inputpreenchido.directive';
import { CombopreenchidoDirective } from '../../diretiva/combopreenchido.directive';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { get } from 'http';
import { CadastroLoginService } from '../../service/cadastro-login.service';
import { LoadingComponent } from '../../components/loading/loading.component';


@Component({
  selector: 'app-cadastro-login',
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
    FormatatelefoneDirective,
    ToastComponent,
    InputpreenchidoDirective,
    CheckboxModule,
    PasswordModule,
    DividerModule,
    LoadingComponent,
  ],
  templateUrl: './cadastro-login.component.html',
  styleUrl: './cadastro-login.component.css',
})
export class CadastroLoginComponent {
  showProgress: boolean = false;
  isLoadingResults: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private toast: ToastComponent,
    private cadastraLoginservice: CadastroLoginService
  ) {}

  cadastraLoginForm = this.formBuilder.group({
    cpf: ['81580053068', Validators.required],
    nome: ['asd', Validators.required],
    email: [
      'asd@gmail.com',
      [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ],
    ],
    confirmaEmail: [
      'asd@gmail.com',
      [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ],
    ],
    senha: ['123', Validators.required],
    confirmaSenha: ['123', Validators.required],
    termoUso: ['', [Validators.required, Validators.requiredTrue]],
  });

  postCadastraLogin(value: any) {
    this.isLoadingResults = true;
    this.showProgress = false;

    if (value.senha !== value.confirmaSenha) {
      this.toast.toast('error', 'Erro', 'As senhas não conferem');
      this.isLoadingResults = false;
      this.showProgress = false;
      return;
    }
    if (value.email !== value.confirmaEmail) {
      this.toast.toast('error', 'Erro', 'Os e-mails não conferem');
      this.isLoadingResults = false;
      this.showProgress = false;
      return;
    }

    /*************  ✨ VALIDACAO DO CPF ⭐  *************/
    if (value.cpf.length < 15) {
      let cpf = value.cpf.replace(/\D/g, '');
      let soma: number = 0;
      let peso: number = 10;
      for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (peso - i);
      }
      let resultado: number = 11 - (soma % 11);
      if (resultado == 10 || resultado == 11) {
        resultado = 0;
      }
      if (resultado != parseInt(cpf.charAt(9))) {
        this.toast.toast('error', 'Erro', 'CPF inválido');
        this.isLoadingResults = false;
        this.showProgress = false;
        return;
      }
      soma = 0;
      peso = 11;
      for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (peso - i);
      }
      resultado = 11 - (soma % 11);
      if (resultado == 10 || resultado == 11) {
        resultado = 0;
      }
      if (resultado != parseInt(cpf.charAt(10))) {
        this.toast.toast('error', 'Erro', 'CPF inválido');
        this.isLoadingResults = false;
        this.showProgress = false;
        return;
      }
    }
    /*************  ✨ VALIDACAO DO CPF ⭐  *************/

    console.log(value);
    // this.isLoadingResults = false;
    // this.showProgress = false;
let valores = {
      cpf: value.cpf,
      nome: value.nome,
      email: value.email,
      senha: value.senha,
      termoUso: value.termoUso
    }
    this.cadastraLoginservice.postCadastroLogin(valores).subscribe(
      (data: any) => {
        if (Array.isArray(data)) {
          console.log('no botao ', data);
          let codigo = JSON.parse(data[0][0].result).codigo;
          let mensagem = JSON.parse(data[0][0].result).status;
          if (codigo == '0') {
            this.toast.toast('success', 'Sucesso', mensagem);
          }
          if (codigo == '1') {
            this.toast.toast('error', 'Erro', mensagem);
          }
        } else {
          let mensagem = JSON.parse(JSON.stringify(data)).error;
          this.toast.toast('error', 'Erro', mensagem);
        }
        this.isLoadingResults = false;
        this.showProgress = false;
      },
      (error: any) => {
        this.isLoadingResults = false;
        this.showProgress = false;
        this.toast.toast('error', 'Erro', 'Erro ao salvar., tente mais tarde.');
      }
    );
  }
}
