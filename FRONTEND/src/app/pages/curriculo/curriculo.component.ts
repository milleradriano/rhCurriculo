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
    AsyncPipe,
    MatGridListModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MenuComponent,
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
    UploaddocumentoComponent,
  ],
})
export class CurriculoComponent {
  limparFilhos($event: any) {
    console.log('Limpar Filhos ', $event);
  }
  estadoCivil: any = [];
  estadoEmissor: any[] | undefined;
  grauInstrucao: any[] | undefined;

  turnoEscola: any[] | undefined;
  deficiencia: any[] | undefined;

  constructor(
    private messageService: MessageService,
    private breakpointObserver: BreakpointObserver,
    private formBuilder: FormBuilder
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
    sexo: ['', Validators.required],
    estadoCivil: ['', Validators.required],
    cpf: ['', Validators.required],
    rg: ['', Validators.required],
    orgaoEmissor: ['', Validators.required],
    dataEmissao: ['', Validators.required],
    estadoEmissor: ['', Validators.required],
    dataNascimento: ['', Validators.required],
    nomePai: ['', Validators.required],
    nomeMae: ['', Validators.required],
    grauInstrucao: ['', Validators.required],
    estudaAtualmente: ['N'],
    telefone: ['', Validators.required],
    email: [
      '',
      [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ],
    ],
    turno: [''],
    filhos: ['N'],
    numFilhos: [''],
    pcd: ['N', Validators.required],
    deficiencia: [''],
  });
  onBasicUploadAuto(event: any) {
    this.messageService.add({
      severity: 'info',
      summary: 'Success',
      detail: 'File Uploaded with Auto Mode',
    });
  }
}
