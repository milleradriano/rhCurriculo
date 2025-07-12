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
import { FormatacpfDirective } from '../../diretivas/formatacpf.directive';


import { LocalstorageService } from '../../service/localstorage.service';
import { MensagemAlertaComponent } from '../../components/mensagem-alerta/mensagem-alerta.component';
import { ToastService } from '../../service/toast.service';

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
   
    
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(
    private messageService: MessageService,
    private localStorageService: LocalstorageService,
    private toast: ToastService,
  ) {}
  login($event: any) {
    console.log($event);
    this.localStorageService.setLogin('idc', $event.login);
  }
  formBuilder = new FormBuilder();
  loginForm = this.formBuilder.group({
    login: ['', Validators.required],
    password: ['', Validators.required],
  });
}
