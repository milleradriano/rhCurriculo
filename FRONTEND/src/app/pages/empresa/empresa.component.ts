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
import { FileUploadModule, UploadEvent } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { UploaddocumentoComponent } from '../../components/uploaddocumento/uploaddocumento.component';
import { GridComponent } from '../../components/grid/grid.component';
import { ConfirmacaoComponent } from '../../components/confirmacao/confirmacao.component';
import { ToastComponent } from '../../components/toast/toast.component';
import { EmpresaService } from '../../service/empresa.service';
import { ProgressbarComponent } from '../../components/progressbar/progressbar.component';
import { LoadingComponent } from '../../components/loading/loading.component';
import { TooltipModule } from 'primeng/tooltip';
import { error } from 'console';
@Component({
  selector: 'app-empresa',
  standalone: true,
  providers: [MessageService, ConfirmacaoComponent],
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
    UploaddocumentoComponent,
    GridComponent,
    ConfirmacaoComponent,
    ToastComponent,
    ProgressbarComponent,
    LoadingComponent,
    TooltipModule,
  ],
  templateUrl: './empresa.component.html',
  styleUrl: './empresa.component.css',
})
export class EmpresaComponent {
  private retornoApi$!: any;

  showProgress: boolean = false;
  isLoadingResults: boolean = false;
  // isRateLimitReached = false;
  // resultsLength = 0;
  loading: boolean = false;
  private formbuilder = inject(FormBuilder)
  constructor(  
    private messageService: MessageService,
    private toast: ToastComponent,
    private confirmacao: ConfirmacaoComponent,
    private empresaService: EmpresaService
  ) {}
  empresaForm = this.formbuilder.group({
    idempresa: [''],
    descempresa: ['', Validators.required],
    desccidade: ['', Validators.required],
    maps: ['', Validators.required],
  });
  
  ngOnDestroy() {
    this.retornoApi$.unsubscribe();
  }
  /* TITULO DO GRID*/
  title: string[] = ['idempresa', 'descempresa', 'atualizar'];
  translatedTitles: { [key: string]: string } = {
    idempresa: 'Empresa',
    descempresa: 'Descrição da Empresa',
    atualizar: 'Ação',
  };
  dataSourceGrid: any[] = [];
  ngOnInit() {
    this.carregaGrid();
  }

  recebeValores(valores: any) {
    console.log('valores', valores);
    console.log('valores EMPRESA', valores);
    this.empresaForm.controls['idempresa'].setValue(valores.idempresa);
    this.empresaForm.controls['descempresa'].setValue(valores.descempresa);
    this.empresaForm.controls['desccidade'].setValue(valores.desccidade);
    this.empresaForm.controls['maps'].setValue(valores.maps);
  }
  onUpload(event: UploadEvent) {
    this.messageService.add({
      severity: 'info',
      summary: 'Success',
      detail: 'File Uploaded with Basic Mode',
    });
  }
  carregaGrid() {
    this.isLoadingResults = true;
    this.retornoApi$ = this.empresaService.getEmpresa().subscribe(
      (data) => {
        if (Array.isArray(data)) {
          this.dataSourceGrid = data;
        } else {
          this.dataSourceGrid = JSON.parse(JSON.stringify(data));
        }
      },
      (error) => {
        if (error.status == 403) {
          this.showProgress = true;
        } else if (error.status == 0) {
          this.toast.toast('error', 'Erro', 'Sem conexão com o servidor');
          this.showProgress = true;
        } else
          this.toast.toast(
            'error',
            'Erro',
            error.status.toString() + '-' + error.statusText
          );
      }
    );
  }
  limparCampos() {
    this.empresaForm.reset();
  }
  delEmpresa(valores: any) {
    this.confirmacao.confirmaExclusao(
      'Você tem certeza que deseja excluir este item?',
      () => {
        let mensagem: string = '';
        this.loading = true;
        this.empresaService.delempresa(valores.idempresa).subscribe(
          (data) => {
            if (Array.isArray(data)) {
              mensagem = JSON.parse(data[0][0].result).status;
              console.log('result me', JSON.parse(JSON.stringify(data)));
            } else {
              mensagem = JSON.parse(JSON.stringify(data));
              console.log('result me1', JSON.parse(JSON.stringify(data)));
            }
            this.toast.toast('success', 'Sucesso', mensagem);
            this.carregaGrid();
            this.limparCampos();
            this.loading = false;
          },
          (error) => {
            this.loading = false;
            console.log('error nop emp', error);
            this.toast.toast(
              'error',
              'Erro',
              'Erro ao salvar.' + error.message
            );
          }
        );
      }
    );
  }

  postEmpresa(valores: any) {
    this.loading = true;
    console.log('post VALOR', valores);
    this.isLoadingResults = true;
    let mensagem: string = '';
    this.empresaService.postEmpresa(valores).subscribe(
      (data) => {
        if (Array.isArray(data)) {
          mensagem = JSON.parse(data[0][0].result).status;
          console.log('result linha 82', JSON.parse(data[0][0].result).status);
          this.loading = false;
          this.toast.toast('success', 'Sucesso', mensagem);
          this.carregaGrid();
        } else {
          console.log('result2', JSON.parse(JSON.stringify(data)));
          mensagem = JSON.parse(JSON.stringify(data));
          this.loading = false;
        }

        // this.carregaGrid(); // Recarrega o grid aqui
        this.limparCampos();

        this.isLoadingResults = false;
        this.loading = false;
      },
      (error) => {
        console.log('error aqio', error);
        this.loading = false;
        this.toast.toast(
          'error',
          'Erro',
          'Erro ao excluir., tente mais tarde.'
        );
      }
    );
  }
}
