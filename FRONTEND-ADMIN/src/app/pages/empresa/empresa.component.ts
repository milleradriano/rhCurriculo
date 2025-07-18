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
import { FileUploadModule, FileUpload } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { GridComponent } from '../../components/grid/grid.component';
import { ConfirmacaoComponent } from '../../components/confirmacao/confirmacao.component';
import { ToastService } from '../../service/toast.service';
import { EmpresaService } from '../../service/empresa.service';
import { UploadLogoService } from '../../service/upload-logo.service';
import { ProgressbarComponent } from '../../components/progressbar/progressbar.component';
import { LoadingComponent } from '../../components/loading/loading.component';
import { TooltipModule } from 'primeng/tooltip';
import { Image, ImageModule } from 'primeng/image';
import { environment } from '../../../environments/environment.prod';

import { SessionStorageService } from '../../service/sessionStorage.service';
import { FileUploaderComponent } from '../../components/file-uploader/uploaddocumento.component';
import { TituloTopoComponent } from '../../components/titulo-topo/titulo-topo.component';
import { TituloTopoService } from '../../service/titulo-topo.service';
@Component({
  selector: 'app-empresa',
  standalone: true,
  providers: [
    MessageService,
    ConfirmacaoComponent,
    ToastService,
    EmpresaService,
    UploadLogoService,
  ],
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
    ProgressbarComponent,
    LoadingComponent,
    TooltipModule,
    FileUploadModule,
    ImageModule,
    FileUploaderComponent,
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

  private formBuilder = inject(FormBuilder);
  @ViewChild(FileUploaderComponent) fileUploader!: FileUploaderComponent;
  urlLogo: any;
  submitSuccess: boolean = false;
  submitError: boolean = false;
  constructor(
    private messageService: MessageService,
    private toast: ToastService,
    private confirmacao: ConfirmacaoComponent,
    private empresaService: EmpresaService,
    private uploadLogoService: UploadLogoService,
    private sessionStorage: SessionStorageService,
    private nomeTopoService: TituloTopoService
  ) {
  this.nomeTopoService.setTituloTopo('Cadastro de Empresa');
  }
  empresaForm = this.formBuilder.group({
    idempresa: [''],
    descempresa: ['', Validators.required],
    desccidade: ['', Validators.required],
    maps: ['', Validators.required],
    logo: [''],
  });

  ngOnDestroy() {
    if (this.retornoApi$) this.retornoApi$.unsubscribe();
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
    console.log('click grid', valores);
    // console.log('valores EMPRESA', environment.api + JSON.stringify( valores.logo));
    this.empresaForm.controls['idempresa'].setValue(valores.idempresa);
    this.empresaForm.controls['descempresa'].setValue(valores.descempresa);
    this.empresaForm.controls['desccidade'].setValue(valores.desccidade);
    this.empresaForm.controls['maps'].setValue(valores.maps);
    this.empresaForm.controls['logo'].setValue(valores.logo);
    if (valores.logo !== null) {
      this.urlLogo = environment.api + '/' + valores.logo;
      console.log('click grid', this.urlLogo);
    }
  }

  /*************  ✨ Windsurf Command 🌟  *************/
  carregaGrid() {
    this.isLoadingResults = true;
    this.empresaService.getEmpresa().subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.dataSourceGrid = data;
          console.log('get empresa', this.dataSourceGrid);
        } else {
          this.dataSourceGrid = JSON.parse(JSON.stringify(data));
        }
      },
      error: (error) => {
        if (error.status === 403) {
          this.showProgress = true;
        } else if (error.status === 0) {
          this.toast.erro(error);
          this.showProgress = true;
        } else {
          this.toast.erro(error);
        }
      },
    });
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
            this.toast.sucesso(mensagem);
            this.carregaGrid();
            this.limparCampos();
            this.loading = false;
          },
          (error) => {
            this.loading = false;
            console.log('error nop emp', error);
            this.toast.erro(error);
          }
        );
      }
    );
  }
  onErrorUpload($event: any) {
    console.log('error no upload', $event);
    this.toast.erro($event);
  }
  renameFile(file: File, newName: string): File {
    const blob = file.slice(0, file.size, file.type);
    return new File([blob], newName, { type: file.type });
  }
  nomeImagem: string = '';
  postImagem() {  
    this.fileUploader.uploadFiles();
    // Ouve o evento de conclusão do upload
    this.fileUploader.uploadComplete.subscribe((success) => {
      this.submitSuccess = success;
      this.submitError = !success;
  
    });   
  }
recebeNomeImagem(valores: any) {
  this.nomeImagem = valores;
  console.log('nomeImagem', this.nomeImagem);
}
  postEmpresa(valores: any) {
    // // this.postImagem(valores.idempresa);
    this.loading = true;
   
    this.isLoadingResults = true;
    let mensagem: string = '';
    valores.logo = 'logo/' + this.nomeImagem;
  
  
    console.log('valores EMPRESA', valores);
    this.empresaService.postEmpresa(valores).subscribe(
      (data) => {
      
        if (1+1 === 2) {
          mensagem = JSON.parse(JSON.stringify(data)).serverStatus;
        
          this.loading = false;
          this.toast.sucesso(mensagem);
          this.postImagem();          

          this.carregaGrid();
        } else {
         
          mensagem = JSON.parse(JSON.stringify(data));
          this.toast.erro(mensagem);
          this.loading = false;
        }

        // this.carregaGrid(); // Recarrega o grid aqui
        this.limparCampos();

        this.isLoadingResults = false;
        this.loading = false;
      },
      (error) => {
     
        this.loading = false;
        this.toast.erro(error);
      }
    );
  }
}
