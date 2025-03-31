import { Component, inject, Input, input,OnInit } from '@angular/core';
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
import { CurriculoService } from '../../service/curriculo.service';
import { InputreadonlyDirective } from '../../diretiva/inputreadonly.directive';
import { InputpreenchidoDirective } from '../../diretiva/inputpreenchido.directive';
import { CombopreenchidoDirective } from '../../diretiva/combopreenchido.directive';
import { interfaceCurriculo } from '../../interface/curriculo';
// import { LoadingComponent } from '../../components/loading/loading.component';
import { ToastComponent } from '../../components/toast/toast.component';
import { ConfirmacaoComponent } from '../../components/confirmacao/confirmacao.component';
import { HttpHeaders } from '@angular/common/http';
import { LoadingComponent } from "../../components/loading/loading.component";
import { ProgressbarComponent } from "../../components/progressbar/progressbar.component";
import { Console } from 'node:console';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}
@Component({
  selector: 'app-curriculo',
  templateUrl: './curriculo.component.html',
  styleUrl: './curriculo.component.css',
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
    InputMaskModule,
    FormatacpfDirective,
    ApenasNumeroDirective,
    FormatatelefoneDirective,
    ToastComponent,
    InputreadonlyDirective,
    InputpreenchidoDirective,
    // LoadingComponent,
    ConfirmacaoComponent,
    LoadingComponent,
    ProgressbarComponent
],
})
export class CurriculoComponent implements OnInit {

  private retornoApi$!: any;

  showProgress: boolean = false;
  isLoadingResults: boolean = false; // habilita/desabilita o spinner
  isReadonly: boolean = true;

  limparFilhos($event: any) {
    console.log('Limpar Filhos ', $event);
  }
  estadoCivil: any = [];
  estadoEmissor: any[] | undefined;
  grauInstrucao: any[] | undefined;

  turnoEscola: any[] | undefined;
  deficiencia: any[] | undefined;
  sessionCpf :string  | null= this.sessionStorage.getLogin('cpf');
  sessionToken :string  | null= this.sessionStorage.getLogin('token');

  headers = new HttpHeaders({ 'Authorization': `Bearer ${this.sessionToken}` });
  constructor(
    private messageService: MessageService,
    private breakpointObserver: BreakpointObserver,
    private formBuilder: FormBuilder,
    private sessionStorage: SessionstorageService,
    private toast: ToastComponent,
    private curriculoService: CurriculoService,

    // private loadingComponent: LoadingComponent,
    private confirmacaoComponent: ConfirmacaoComponent
  
  ) { 
    this.estadoCivil = [
      { label: 'Solteiro', value: 'Solteiro' },
      { label: 'Casado', value: 'Casado' },
      { label: 'Divorciado', value: 'Divorciado' },
      { label: 'Viuvo', value: 'Viuvo' },
      { label: 'Separado', value: 'Separado' },
      { label: 'Uniao Estavel', value: 'Uniao Estavel' },
    ];
    this.estadoEmissor = [
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
    this.grauInstrucao = [
      { label: 'Fundamental Incompleto', value: 'Fundamental Incompleto' },
      { label: 'Fundamental Completo', value: 'Fundamental Completo' },
      { label: 'Ensino Medio Incompleto', value: 'Ensino Medio Incompleto' },
      { label: 'Ensino Medio Completo', value: 'Ensino Medio Completo' },
      { label: 'Superior Incompleto', value: 'Superior Incompleto' },
      { label: 'Superior Completo', value: 'Superior Completo' },
    ];
    this.turnoEscola = [
      { label: 'Manhã', value: 'Manhã' },
      { label: 'Tarde', value: 'Tarde' },
      { label: 'Noite', value: 'Noite' },
      { label: 'Integral', value: 'Integral' },
    ];
    this.deficiencia = [
      { label: 'Fisica', value: 'Fisica' },
      { label: 'Auditiva', value: 'Auditiva' },
      { label: 'Visual', value: 'Visual' },
      { label: 'Intelectual', value: 'Intelectual' },
    ];
    console.log('inicio');
  }

  curriculoForm = this.formBuilder.group({
    nome: ['', Validators.required],
    sexo: ['', Validators.required], // nao mudar
    estadoCivil: ['', Validators.required],
    cpf: [this.sessionCpf, Validators.required],
    rg: ['', Validators.required],
    orgaoEmissor: ['', Validators.required],
    dataEmissao: ['', Validators.required],
    estadoEmissor: ['', Validators.required],
    dataNascimento: ['', Validators.required],
    nomePai: ['', Validators.required],
    nomeMae: ['', Validators.required],
    grauInstrucao: ['', Validators.required],
    estudaAtualmente: ['N'], // nao mudar
    telefone: ['', Validators.required],
    email: [
      '',
      [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ],
    ],
    turno: [''],
    filhos: ['N'], //não mudar
    numFilhos: [''],
    pcd: ['N', Validators.required], //nao mudar
    deficiencia: [''],
  });

  
  onBasicUploadAuto(event: any) {
    this.messageService.add({
      severity: 'info',
      summary: 'Success',
      detail: 'File Uploaded with Auto Mode',
    });
  }
  ngOnInit() {
   
    if (this.sessionCpf) {
      this.getCurriculo(this.sessionCpf);
      
    } else {
      console.error('CPF is null or undefined');
    }
  }
  // }
  // async validaToken() {
  //   console.log('dentro do valida');
  //   if (!this.sessionToken) {
  //     this.isLoadingResults = false;      
  //     this.toast.toast('error', 'Erro', 'Erro ao carregar curriculo.');
  //     return true;
  //   }  

  // }
   getCurriculo(cpf: string) {
    this.isLoadingResults = true;
    console.log('passou do valida')    

// if ( await this.validaToken()) {
    this.curriculoService.getCurriculo(cpf, this.headers).subscribe(
      (data: any) => {
      
        if (data.length > 0 && data[0].nome) {
          try {
            console.log(data[0].nome)
            // const nome = JSON.parse(data[0].nome); // Verifica se é um JSON válido
            this.curriculoForm.patchValue({
              nome: data[0].nome,
              sexo: data[0].sexo,
              estadoCivil: data[0].estadoCivil,
              cpf: data[0].cpf,
              rg: data[0].rg,
              orgaoEmissor: data[0].orgaoEmissor,
              dataEmissao: data[0].dataEmissao,
              estadoEmissor: data[0].estadoEmissor,
              dataNascimento: data[0].dataNascimento,
              nomePai: data[0].nomePai,
              nomeMae: data[0].nomeMae,
              grauInstrucao: data[0].grauInstrucao,
              estudaAtualmente: data[0].estudaAtualmente,
              telefone: data[0].telefone,
              email: data[0].email,
              turno: data[0].turno,
              filhos: data[0].filhos,
              numFilhos: data[0].numFilhos,
              pcd: data[0].pcd,
              deficiencia: data[0].deficiencia,
          })
          this.isLoadingResults = false;
          } catch (error:any) {
            this.isLoadingResults = false;
            console.error('Erro ao fazer parse do nome:', error);
            this.toast.toast('error', 'Erro', error);
          }
        } else {
          this.isLoadingResults = false;        
          console.warn('Nenhum dado encontrado para o CPF:', cpf);
        }
      },
      (error: any) => {
        this.isLoadingResults = false;
        this.toast.toast('error', 'Erro', error);  
        this.showProgress = true;   
      
      }
    );
  }



  postCurriculo(valores: any) {
 
    let mensagem: string = '';
    this.isLoadingResults = true;
    
    this.curriculoService.postCurriculo(valores, this.headers).subscribe(
      (data: any) => {
        if (Array.isArray(data)) {
          mensagem = JSON.parse(data[0][0].result).status;        
          this.isLoadingResults = false;
          this.toast.toast('success', 'Sucesso', mensagem);
        } else {       
          mensagem = JSON.parse(JSON.stringify(data)).error;
          this.toast.toast('error', 'Erro', mensagem);
          this.isLoadingResults = false;
        }
      },
      (error: any) => {      
        this.isLoadingResults = false;
        this.toast.toast('error', 'Erro', 'Erro ao salvar., tente mais tarde.');
      }
    );
  }
}
