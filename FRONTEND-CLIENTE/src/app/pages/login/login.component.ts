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
import { LocalstorageService } from '../../service/localstorage.service';
import { MensagemAlertaComponent } from '../../components/mensagem-alerta/mensagem-alerta.component';
import { ToastComponent } from '../../components/toast/toast.component';
import { PasswordModule } from 'primeng/password';
import { RecuperaSenhaComponent } from '../recupera-senha/recupera-senha.component';
import {
  DialogService,
  DynamicDialogModule,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { Login } from '../../interface/login';

import { DialogModule } from 'primeng/dialog';
import { LoadingComponent } from "../../components/loading/loading.component";
import { LoginService } from '../../service/login.service';

import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
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
    PasswordModule,
    RecuperaSenhaComponent,
    DynamicDialogModule,
    DialogModule,
    LoadingComponent,
    
],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  cpf: string = '';
  password: string = '';
  mostrarModalRecuperaSenha: boolean = false;
  isLoadingResults: boolean = false;


  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private toast: ToastComponent,
    private router: Router  
  ) {}
  
  
    loginForm = this.formBuilder.group({
      cpf: ['81580053068', Validators.required],
      senha: ['12', Validators.required],
    });
    postLogin($event: Partial<{ cpf: string; senha: string }>) {
  
    
    this.isLoadingResults = true;
    this.loginService.postLogin($event).subscribe(
      (data: any) => {
        this.isLoadingResults = false;
        console.log("login 102", data);
        if (data.token) {
          //recebe token caso login seja bem sucedido 
        console.log("token", data.token);
        sessionStorage.setItem("token", data.token);    
        this.router.navigate(["/menu"]);
        }
        else{
          this.toast.toast("error", "", data);
        }
      },
      (error: any) => {
        this.isLoadingResults = false;
        console.log("login 109", error);
        this.toast.toast("error", "", error);
      }
    );
    // this.loginService.postLogin($event).subscribe(
    //   (data:any) => {
    //              //recebe token caso login seja bem sucedido
    //       this.isLoadingResults = false;
    //       console.log('login 102', typeof(data));          
          
    //     },
    //   (error:any)=>{
    //     this.isLoadingResults = false;
    //     console.log('login 109', error);
    //     this.toast.toast('error', '' , error);
    //   }
    // );  
  }

  
  recuperaSenha() {
    this.mostrarModalRecuperaSenha = true;
  }
}
