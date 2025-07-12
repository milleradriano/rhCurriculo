import {
  Component,
  ViewChild,
  signal,
  effect,
  Output,
  EventEmitter,
} from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { UploadLogoService } from '../../service/upload-logo.service';
import { SessionStorageService } from '../../service/sessionStorage.service';
@Component({
  selector: 'app-file-uploader',
  standalone: true,
  imports: [FileUploadModule],
  templateUrl: './uploaddocumento.component.html',
  styleUrl: './uploaddocumento.component.css',
  
})
export class FileUploaderComponent {
  @ViewChild('fileUploader') fileUploader!: FileUpload;
  selectedFiles = signal<File[]>([]);
  uploading = signal(false);
  uploadSuccess = signal(false);
  uploadError = signal(false);
  uploadErrorMessage = signal('');
  nomeArquivo = signal('');
  progress = signal(0);
  sessionToken: string | null = this.sessionStorage.getLogin('token');
  headers = new HttpHeaders({ Authorization: `Bearer ${this.sessionToken}` });
  @Output() uploadComplete = new EventEmitter<boolean>();
  @Output() nomeArquivoSelecionado = new EventEmitter<string>();
  constructor(
    private http: HttpClient,
    private uploadService: UploadLogoService,
    private sessionStorage: SessionStorageService
  ) {
    effect(() => {
      if (this.uploadSuccess()) {
        this.fileUploader.clear();
        this.selectedFiles.set([]);
      }
    });
  }

  onFileSelected(event: any): void {
    this.selectedFiles.set(event.currentFiles);
    this.uploadSuccess.set(false);
    this.uploadError.set(false);
    console.log('Arquivos selecionados no onFileSelected:', event.currentFiles[0].name);
    this.nomeArquivoSelecionado.emit(event.currentFiles[0].name);
  }

  onUploadError(event: any): void {
    console.error('Erro no upload via PrimeNG:', event);
    this.uploadError.set(true);
    this.uploadErrorMessage.set('Erro ao selecionar o arquivo.');
  }
  renameFile(file: File, newName: string): File {
    const blob = file.slice(0, file.size, file.type);
    return new File([blob], newName, { type: file.type });
  }
  nomeImagem: string = '';

  uploadFiles(): void {
    console.log('Iniciando o upload dos arquivos...');
    if (this.fileUploader.files && this.fileUploader.files.length > 0) {
      console.log('Arquivos selecionados:', this.fileUploader.files[0].name);
      //****carregas as informações do arquivo
      this.fileUploader.upload();
      //****carregas as informações do arquivo
      let file = this.fileUploader.files[0];        
      this.nomeImagem = file.name;
      console.log('nomeImagem', this.nomeImagem);
      if (this.fileUploader.files) {
        this.uploadService.uploadLogo([file], this.headers).subscribe(
          (data) => {
            console.log('data', data);
            console.log('imagem enviada');
            this.fileUploader.clear();
          },

          (error) => {
            if (error.status == 403) {
              console.log('403');
            } else if (error.status == 0) {
              console.log('403');
            } else
              this.uploadErrorMessage.set(
                error.status.toString() + '-' + error.statusText
              );
            this.uploadError.set(true);
            console.log('error file-uploader ', error);
          }
        );
      }
    }
  }
}