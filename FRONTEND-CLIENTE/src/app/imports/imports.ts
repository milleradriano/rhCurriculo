import { Component, inject, Input, input, NgModule } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

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
import { FormatacpfDirective } from '../diretiva/formatacpf.directive';
import { ObservacaobottonComponent } from '../components/observacaobotton/observacaobotton.component';
import { ApenasNumeroDirective } from '../diretiva/apenasnumero.directive';
import { FormatatelefoneDirective } from '../diretiva/formatatelefone.directive';
import { UploaddocumentoComponent } from '../components/uploaddocumento/uploaddocumento.component';
import { LocalstorageService } from '../service/sessionlstorage.service';
import { ToastComponent } from '../components/toast/toast.component';
import { CurriculoService } from '../service/curriculo.service';
import { InputreadonlyDirective } from '../diretiva/inputreadonly.directive';
import { InputpreenchidoDirective } from '../diretiva/inputpreenchido.directive';
import { CombopreenchidoDirective } from '../diretiva/combopreenchido.directive';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { get } from 'http';
@NgModule({
  imports: [  MatGridListModule,
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
    PasswordModule,DividerModule],
  exports: [MatGridListModule,
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
    PasswordModule,DividerModule],
    providers: []

})
export class ImportsModule { }