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
import { ObservacaobottonComponent } from '../../components/observacaobotton/observacaobotton.component';
import { ApenasNumeroDirective } from '../../diretivas/apenasnumero.directive';
import { FormatatelefoneDirective } from '../../diretivas/formatatelefone.directive';
import { UploaddocumentoComponent } from '../../components/uploaddocumento/uploaddocumento.component';
import { LocalstorageService } from '../../service/localstorage.service';
import { ToastComponent } from '../../components/toast/toast.component';
import { CurriculoService } from '../../service/curriculo.service';
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
    ObservacaobottonComponent,
    ApenasNumeroDirective,
    FormatatelefoneDirective,
    ToastComponent,
  ],
})
export class CurriculoComponent {
  private retornoApi$!: any;

  showProgress: boolean = false;
  isLoadingResults: boolean = false;
  // isRateLimitReached = false;
  // resultsLength = 0;
  loading: boolean = false;

  limparFilhos($event: any) {
    console.log('Limpar Filhos ', $event);
  }
  estadoCivil: any = [];
  estadoEmissor: any[] | undefined;
  grauInstrucao: any[] | undefined;

  turnoEscola: any[] | undefined;
  deficiencia: any[] | undefined;
  tokenCpf = this.localStorageService.getLogin('idc');
  constructor(
    private messageService: MessageService,
    private breakpointObserver: BreakpointObserver,
    private formBuilder: FormBuilder,
    private localStorageService: LocalstorageService,
    private toast: ToastComponent,
    private curriculoService: CurriculoService
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
  }
  curriculoForm = this.formBuilder.group({
    sexo: ['', Validators.required],
    nome: ['', Validators.required],
    estadoCivil: ['', Validators.required],
    cpf: [this.tokenCpf],

    rg: ['', Validators.required],
    orgaoEmissor: ['', Validators.required],
    dataEmissao: ['', Validators.required],
    estadoEmissor: ['', Validators.required],
    dataNascimento: ['', Validators.required],
    nomePai: ['', Validators.required],
    nomeMae: ['', Validators.required],
    grauInstrucao: ['', Validators.required],
    estudaAtualmente: [''],
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

  postCurriculo(valores: any) {
    console.log('post curriculo ', valores);
    let mensagem: string = '';
    this.loading = true;
    this.curriculoService.postCurriculo(valores).subscribe(
      (data: any) => {
        if (Array.isArray(data)) {
          mensagem = JSON.parse(data[0][0].result).status;
          console.log('result linha 82', JSON.parse(data[0][0].result).status);
          this.loading = false;
          this.toast.toast('success', 'Sucesso', mensagem);
        } else {
          console.log('result2', JSON.parse(JSON.stringify(data)).error);
          mensagem = JSON.parse(JSON.stringify(data)).error;
          this.toast.toast('error', 'Erro', mensagem);
          this.loading = false;
        }
        this.isLoadingResults = false;
        this.loading = false;
      },
      (error: any) => {
        console.log('error aqio', error);
        this.loading = false;
        this.toast.toast('error', 'Erro', 'Erro ao salvar., tente mais tarde.');
      }
    );
  }
}
