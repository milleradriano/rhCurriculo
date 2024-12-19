import { Component, inject, ViewChild } from '@angular/core';

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
import {

  FileUploadModule,

  FileUpload,
} from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { GridComponent } from '../../components/grid/grid.component';
import { ConfirmacaoComponent } from '../../components/confirmacao/confirmacao.component';
import { ToastComponent } from '../../components/toast/toast.component';
import { EmpresaService } from '../../service/empresa.service';
import { UploadLogoService } from '../../service/upload-logo.service';
import { ProgressbarComponent } from '../../components/progressbar/progressbar.component';
import { LoadingComponent } from '../../components/loading/loading.component';
import { TooltipModule } from 'primeng/tooltip';
import { Image, ImageModule } from 'primeng/image';
import { environment } from '../../../environments/environment';
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
    GridComponent,
    ConfirmacaoComponent,
    ToastComponent,
    ProgressbarComponent,
    LoadingComponent,
    TooltipModule,
    FileUploadModule,
    ImageModule,
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

  private formbuilder = inject(FormBuilder);
  @ViewChild('fileUploader') fileUploader!: FileUpload;
  urlLogo: any;
  constructor(
    private messageService: MessageService,
    private toast: ToastComponent,
    private confirmacao: ConfirmacaoComponent,
    private empresaService: EmpresaService,
    private uploadLogoService: UploadLogoService
  ) {}
  empresaForm = this.formbuilder.group({
    idempresa: [''],
    descempresa: ['', Validators.required],
    desccidade: ['', Validators.required],
    maps: ['', Validators.required],
    logo: [''],
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
    console.log('valores EMPRESA', environment.api + JSON.stringify( valores.logo));
    this.empresaForm.controls['idempresa'].setValue(valores.idempresa);
    this.empresaForm.controls['descempresa'].setValue(valores.descempresa);
    this.empresaForm.controls['desccidade'].setValue(valores.desccidade);
    this.empresaForm.controls['maps'].setValue(valores.maps);
    this.empresaForm.controls['logo'].setValue(valores.logo);
    if (valores.logo !== null) {
      this.urlLogo = environment.api +'/'+  valores.logo;
    }
    
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
    this.urlLogo = '';
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
  onErrorUpload($event: any) {
    console.log('error no upload', $event);
    this.toast.toast('error', 'Erro', $event.error.message);
  }
  renameFile(file: File, newName: string): File {
    const blob = file.slice(0, file.size, file.type);
    return new File([blob], newName, { type: file.type });
  }
  nomeImagem: string = '';
  postImagem(nomeArquivo: string) {
    if (this.fileUploader.files && this.fileUploader.files.length > 0) {
      //****carregas as informações do arquivo
      this.fileUploader.upload();
      //****carregas as informações do arquivo
      let file = this.renameFile(
        this.fileUploader.files[0],
        nomeArquivo + '.jpg'
      );
      this.nomeImagem = file.name;
      if (this.fileUploader.files) {
        this.uploadLogoService.uploadlogo([file]).subscribe(
          (data) => {
            console.log('data', data);
            console.log('imagem enviada');
            this.fileUploader.clear();
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
            console.log('error aqio', error);
          }
        );
      }
    }
  }
alerta(){
  this.toast.toast('success', 'Sucesso', 'teste');
}
  postEmpresa(valores: any) {
    this.postImagem(valores.idempresa);
    this.loading = true;
    console.log('post VALOR', valores.idempresa);
    this.isLoadingResults = true;
    let mensagem: string = '';
    valores.logo = 'logo/' + this.nomeImagem;
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
          this.toast.toast('error', 'Erro', mensagem);
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
