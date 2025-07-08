import {
  Component,
  inject,
  Input,
  input,
  OnInit,
  ViewChild,
} from '@angular/core';
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
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { InputMaskModule } from 'primeng/inputmask';
import { FormatacpfDirective } from '../../diretiva/formatacpf.directive';
import { ApenasNumeroDirective } from '../../diretiva/apenasnumero.directive';
import { FormatatelefoneDirective } from '../../diretiva/formatatelefone.directive';
import { SessionStorageService } from '../../service/sessionlstorage.service';
import { CurriculoService } from '../../service/curriculo.service';
import { InputreadonlyDirective } from '../../diretiva/inputreadonly.directive';
import { InputpreenchidoDirective } from '../../diretiva/inputpreenchido.directive';
import { CombopreenchidoDirective } from '../../diretiva/combopreenchido.directive';
import { interfaceCurriculo } from '../../interface/curriculo';
// import { LoadingComponent } from '../../components/loading/loading.component';
import { ToastService } from '../../service/toast.service';
import { ConfirmacaoComponent } from '../../components/confirmacao/confirmacao.component';
import { HttpHeaders } from '@angular/common/http';
import { LoadingComponent } from '../../components/loading/loading.component';
import { ProgressbarComponent } from '../../components/progressbar/progressbar.component';
import { Console } from 'node:console';
import { FileUploaderComponent } from '../../components/file-uploader/file-uploader.component';
import { DocumentoService } from '../../service/documento.service';

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
    InputMaskModule,
    FormatacpfDirective,
    ApenasNumeroDirective,
    FormatatelefoneDirective,
   
    InputreadonlyDirective,
    InputpreenchidoDirective,
    // LoadingComponent,
    LoadingComponent,
    ProgressbarComponent,
    FileUploaderComponent,
  ],
})
export class CurriculoComponent implements OnInit {
  private retornoApi$!: any;
  @ViewChild(FileUploaderComponent) fileUpdater!: FileUploaderComponent;
  showProgress: boolean = false; // habilita/desabilita o progress bar do fim de sessao
  loading: boolean = false; // habilita/desabilita o spinner
  isReadonly: boolean = true;

  limparFilhos($event: any) {
    console.log('Limpar Filhos ', $event);
  }
  estadoCivil: any = [];
  estadoEmissor: any[] | undefined;
  grauInstrucao: any[] | undefined;

  turnoEscola: any[] | undefined;
  deficiencia: any[] | undefined;
  sessionCpf: string | null = this.sessionStorage.getLogin('cpf');
  sessionToken: string | null = this.sessionStorage.getLogin('token');

  submitSuccess = false;
  submitError = false;
  nomeDocumento : string[] = [];
  headers = new HttpHeaders({ Authorization: `Bearer ${this.sessionToken}` });
  constructor(
    private messageService: MessageService,
    private breakpointObserver: BreakpointObserver,
    private formBuilder: FormBuilder,
    private sessionStorage: SessionStorageService,
    private mensagem: ToastService,
    private curriculoService: CurriculoService,
    private sessionService: SessionStorageService,
    private documentoService: DocumentoService,

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

  private nome: string = '';
  getCurriculo(cpf: string) {
    this.loading = true;

    // if ( await this.validaToken()) {
    this.curriculoService.getCurriculo(cpf, this.headers).subscribe(
      (data: any) => {
        if (data.length > 0 && data[0].nome) {
          try {
            this.nome = data[0].nome;
            this.sessionStorage.setUserName('nome', data[0].nome || '');
            this.sessionStorage.setUserName('idcand', data[0].idcandidato || '');
            this.sessionStorage.updateUserName(this.nome || '');
            this.curriculoForm.patchValue({
              nome: data[0].nome,
              sexo: data[0].sexo,
              estadoCivil: data[0].estadocivil,
              cpf:
                data[0].cpf.substring(0, 3) +
                '.' +
                data[0].cpf.substring(3, 6) +
                '.' +
                data[0].cpf.substring(6, 9) +
                '-' +
                data[0].cpf.substring(9),
              rg: data[0].rg,
              orgaoEmissor: data[0].orgaoemissorrg,
              dataEmissao: data[0].dataexpedicaorg,
              estadoEmissor: data[0].estadorg,
              dataNascimento: data[0].datanascimento,
              nomePai: data[0].nomepai,
              nomeMae: data[0].nomemae,
              grauInstrucao: data[0].grauinstrucao,
              estudaAtualmente: data[0].estudaatualmente,
              telefone: data[0].telefone,
              email: data[0].email,
              turno: data[0].turnoestuda,
              filhos: data[0].possuifilho,
              numFilhos: data[0].numfilho,
              pcd: data[0].pcd,
              deficiencia: data[0].pcddeficiencia,
            });
            this.loading = false;
            this.getDocumento(); // Chama o método para obter o documento após preencher o formulário
          } catch (error: any) {
            this.loading = false;
          
            this.mensagem.erro(error);
          }
        } else {
          this.loading = false;
         this.mensagem.atencao(`Atenção ${cpf} não cadastrado`);
         this.showProgress = true;
        }
      },
      (error: any) => {
        this.loading = false;
        this.mensagem.erro(error);
        this.showProgress = true;
      }
    );
  }

  postCurriculo(valores: any) {
    this.loading = true;
    const pcdControl = this.curriculoForm.get('pcd');
    if (pcdControl && pcdControl.value === 'S') {
      this.postDocumento();
     }

    const idcandidato = sessionStorage.getItem('idcand');
    const cpf = sessionStorage.getItem('cpf');
    valores.cpf = valores.cpf.replace(/\D/g, '');
    /*Adiciona o idcandidato ao objeto valores*/
    valores = { ...valores, idcandidato };    

    const dataNascimento = new Date(valores.dataNascimento);
    const idade = new Date().getFullYear() - dataNascimento.getFullYear();
    if (idade < 18) {    
      this.loading = false;
      this.mensagem.erro('Candidato menor de idade.');        
      return;
    }

    if (valores.dataEmissao < valores.dataNascimento) { 
      this.loading = false;
      this.mensagem.erro('Data de emissão maior que a data de nascimento');    
      return;
    }
    this.curriculoService.postCurriculo(valores, this.headers).subscribe(
      (data) => {
     
        if (JSON.parse(JSON.stringify(data))[0][0].status == '0') {       
          this.loading = false;
          this.mensagem.sucesso('Registro salvo.');
          this.getDocumento(); // Atualiza os documentos após salvar o currículo
        } else {
           this.mensagem.erro('Erro não atualizado');
       
        }
      },
      (error: any) => {
        this.loading = false;
        this.mensagem.erro(error );
        this.showProgress = true;
       
      }
    );
  }

  getDocumento() {
   
    this.loading = true;
    const idcandidato = sessionStorage.getItem('idcand');
    const cpf = sessionStorage.getItem('cpf');
    const valores = [idcandidato, cpf ? cpf.replace(/\D/g, '') : ''];
    if (!idcandidato || !cpf) {
     
      this.loading = false;
      return;
    }
    if (idcandidato) {
      this.documentoService.getDocumento(idcandidato, cpf,this.headers).subscribe(
        (data: any) => {
          if (data.length > 0) {
           this.nomeDocumento = data[0].map((doc: any) => doc.nome);
            this.loading = false;
          } else {           
            this.loading = false;
          }
        },
        (error: any) => {
          this.loading = false;        
          this.mensagem.erro('Erro ao obter documento.');
        }
      );
    } else {    
      this.loading = false;
    }
  }
  postDocumento() {
    try {
      this.fileUpdater.uploadFiles();

      // Ouve o evento de conclusão do upload
      this.fileUpdater.uploadComplete.subscribe((success) => {
        this.submitSuccess = success;
        this.submitError = !success;
      });
      this.getDocumento();   
     
      
    } catch (error) {   
      this.mensagem.erro('Erro ao salvar imagem, tente mais tarde.');
    }
  }
  deleteDocumento(nomeDocumento:string) {
    this.loading = true;
    const idcandidato = sessionStorage.getItem('idcand');
    const cpf = sessionStorage.getItem('cpf');
   
  if (!idcandidato || !cpf) {
 
    this.loading = false;
    return;
  }
  this.documentoService.deleteDocumento({ idcandidato, cpf,nomeDocumento }, this.headers)
    .subscribe(
      (data: any) => {
      
        this.loading = false;
        this.mensagem.sucesso('Documento excluído com sucesso.');
       this.getDocumento(); // Atualiza a lista de documentos após a exclusão
      },
      (error: any) => {
        this.loading = false;
     
        this.mensagem.erro('Erro ao excluir documento.');
      }
    );

}
}