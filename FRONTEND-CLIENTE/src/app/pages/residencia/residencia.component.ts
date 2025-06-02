import { Component, inject, OnInit } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { AsyncPipe, JsonPipe } from '@angular/common';
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
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ObservacaobottonComponent } from '../../components/observacaobotton/observacaobotton.component';
import { FormatacepDirective } from '../../diretiva/formatacep.directive';
import { UploaddocumentoComponent } from '../../components/uploaddocumento/uploaddocumento.component';
import { ResidenciaService } from '../../service/residencia.service';
import { LoadingComponent } from '../../components/loading/loading.component';
import { ToastComponent } from '../../components/toast/toast.component';
import { InputpreenchidoDirective } from '../../diretiva/inputpreenchido.directive';
import { SessionStorageService } from '../../service/sessionlstorage.service';
import { HttpHeaders } from '@angular/common/http';
import { ProgressbarComponent } from "../../components/progressbar/progressbar.component";
@Component({
  selector: 'app-residencia',
  standalone: true,
  providers: [],
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
    ToastComponent,
    InputpreenchidoDirective,
    LoadingComponent,
    ProgressbarComponent
],
  templateUrl: './residencia.component.html',
  styleUrl: './residencia.component.css',
})
export class ResidenciaComponent implements OnInit {
  estado: any[''] | undefined;
  loading: boolean = false;
  showProgress: boolean = false;
  cpf: any = this.sessionStorage.getLogin('cpf')?.replace(/\D/g, '');
  idcandidato: any = this.sessionStorage.getLogin('idcand');
  sessionToken: string | null = this.sessionStorage.getLogin('token');
  headers = new HttpHeaders({ Authorization: `Bearer ${this.sessionToken}` });

  constructor(
    
    private formbuilder: FormBuilder,
    private residenciaService: ResidenciaService,
    private mensagem: ToastComponent,
    private sessionStorage: SessionStorageService
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
  ngOnInit(): void {
    if (this.cpf || this.idcandidato) {
      console.log('cpf no inicio', this.cpf);
      this.getResidencia(this.idcandidato, this.cpf);
    } else {
      console.error('CPF is null or undefined');
    }
  }
  residenciaForm = this.formbuilder.group({
    cep: ['', Validators.required],
    estado: ['', Validators.required],
    cidade: ['', Validators.required],
    endereco: ['', Validators.required],
    bairro: ['', Validators.required],
    numero: ['', Validators.required],
  });

  localizaCep(cep: any) {
    console.log('dentro do cep', cep);
  this.residenciaForm.patchValue({
    numero: ''});
    try {
      this.loading = true;
      this.residenciaService.getCep(cep, this.headers).subscribe((res: any) => {
        console.log('cep', res);
        this.residenciaForm.patchValue({
          cep: res.cep,
          estado: res.uf,
          cidade: res.localidade,
          endereco: res.logradouro,
          bairro: res.bairro,
          
        });
      });
    } catch {
      this.mensagem.toast('error', 'Erro', 'Cep inválido');
    }
    this.loading = false;
  }
  alerta() {
    console.log('dentro do alerta');
    this.mensagem.toast('success', 'Sucesso', 'Residência cadastrada');
  }

  getResidencia(idcandidato: string, cpf: string) {
    this.loading = true;
    let valores: any = { idcandidato: idcandidato, cpf: cpf };
    console.log('valores', valores);
    this.residenciaService
      .getResidencia(valores, this.headers)
      .subscribe((res: any) => {
        console.log('residencia fora', res);
        this.residenciaForm.patchValue({
          cep: res[0].cep.substring(0, 5) + '-' + res[0].cep.substring(5, 8),
          estado: res[0].estado,
          cidade: res[0].cidade,
          endereco: res[0].endereco,
          bairro: res[0].bairro,
          numero: res[0].num,
        });
        console.log('residencia dentro', res);
        this.loading = false;
      });
  }

  postResidencia(valores: any, headers?: any) {
    this.loading = true;
    valores = { ...valores, cpf: this.cpf, idcandidato: this.idcandidato };
    valores.cep = valores.cep.replace(/\D/g, '');
    this.residenciaService.postResidencia(valores, this.headers).subscribe(
      (data) => {
        this.loading = false;
        console.log('RESIDENCIA', JSON.parse(JSON.stringify(data)).status);
        if (JSON.parse(JSON.stringify(data)).status == '0') {
          this.mensagem.toast('success', 'Sucesso', 'Registro Salvo');
        } else {
          this.mensagem.toast('error', 'Erro', 'Não atualizado');
        }
      },
      (error) => {
        this.loading = false;
        this.mensagem.toast('error', 'Erro', 'Indisponível tente mais tarde.');
        // console.log('error aqio', error);
      }
    );
  }
}
