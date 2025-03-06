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
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ObservacaobottonComponent } from '../../components/observacaobotton/observacaobotton.component';
import { FormatacepDirective } from '../../diretiva/formatacep.directive';
import { UploaddocumentoComponent } from '../../components/uploaddocumento/uploaddocumento.component';
import { ResidenciaService } from '../../service/residencia.service';
import { LoadingComponent } from '../../components/loading/loading.component';
import { ToastComponent } from '../../components/toast/toast.component';
import {InputpreenchidoDirective } from '../../diretiva/inputpreenchido.directive';
@Component({
  selector: 'app-residencia',
  standalone: true,
    providers: [MessageService],
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
    InputGroupModule,
    InputGroupAddonModule,
    ObservacaobottonComponent,
    FormatacepDirective,
    LoadingComponent,
    ToastComponent,
    InputpreenchidoDirective,
],
  templateUrl: './residencia.component.html',
  styleUrl: './residencia.component.css',
})
export class ResidenciaComponent {
  estado: any[''] | undefined;
  loading: boolean = false;
  showProgress: boolean = false;

  constructor(
    private messageService: MessageService,
    private formbuilder: FormBuilder,
    private residenciaService: ResidenciaService,
    private toast: ToastComponent
  ) {
    this.estado = [
      { label: 'AC', value: 'AC' },
      { label: 'AL', value: 'AL' },
      { label: 'AP', value: 'AP' },
      { label: 'AM', value: 'AM' },
      { label: 'BA', value: 'BA' },
      { label: 'CE', value: 'CE' },
      { label: 'DF', value: 'DF' },
      { label: 'ES', value: 'ES' },
      { label: 'GO', value: 'GO' },
      { label: 'MA', value: 'MA' },
      { label: 'MT', value: 'MT' },
      { label: 'MS', value: 'MS' },
      { label: 'MG', value: 'MG' },
      { label: 'PA', value: 'PA' },
      { label: 'PB', value: 'PB' },
      { label: 'PR', value: 'PR' },
      { label: 'PE', value: 'PE' },
      { label: 'PI', value: 'PI' },
      { label: 'RJ', value: 'RJ' },
      { label: 'RN', value: 'RN' },
      { label: 'RS', value: 'RS' },
      { label: 'RO', value: 'RO' },
      { label: 'RR', value: 'RR' },
      { label: 'SC', value: 'SC' },
      { label: 'SP', value: 'SP' },
      { label: 'SE', value: 'SE' },
      { label: 'TO', value: 'TO' },
    ];
  }
  residenciaForm = this.formbuilder.group({
    cidade: ['', Validators.required],
    cep: ['', Validators.required],
    estado: ['', Validators.required],
    endereco: ['', Validators.required],
    numero: ['', Validators.required],
    bairro: ['', Validators.required],
  });

  localizaCep(cep: any) {
    this.loading = true;
    this.residenciaService.getCep(cep).subscribe((res) => {
      console.log(res);
      this.residenciaForm.patchValue({
        cep: res.cep,
        estado: res.uf,
        cidade: res.localidade,
        endereco: res.logradouro,
        bairro: res.bairro,
      });
    });
    this.loading = false;
  }
  alerta(){
    console.log('dentro do alerta')
    this.toast.toast('success', 'Sucesso', 'Residência cadastrada');
  }
  postResidencia(valores: any) {
   this.loading = true;
    console.log('POST RESIDENCIA', valores);
    this.residenciaService.postResidencia(valores).subscribe(
      (data) => {
        this.loading = false;
        this.toast.toast('success', 'Sucesso', 'Residência cadastrada');
      },
      (error) => { 
       
        this.loading = false;
        this.toast.toast(
          'error',
          'Erro',
          'Indisponível tente mais tarde.'
        );
        console.log('error aqio', error);
      }
    );
  }
}
