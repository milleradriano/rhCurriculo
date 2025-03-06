import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { error } from 'console';

@Component({
  selector: 'app-uploaddocumento',
  standalone: true,
  imports: [],
  templateUrl: './uploaddocumento.component.html',
  styleUrl: './uploaddocumento.component.css'
})
export class UploaddocumentoComponent {
  selectedFile: File | null = null;

  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onUpload() {
    if (!this.selectedFile) {
      alert('Nenhum arquivo selecionado');
      return;
    }

    const formData = new FormData();
    formData.append('arquivo', this.selectedFile);

    this.http.post<{ message: string; filePath: string }>('/upload', formData)
      .subscribe({
        next: response => {
          console.log('Arquivo salvo:', response.filePath);
          alert('Upload realizado com sucesso!');
        },
        error: err => {
          console.error('Erro ao fazer upload:', err);
          console.error('Erro ao fazer upload quebra: ', JSON.parse(JSON.stringify(err)).error.error.message);
          
          alert("Erro ao fazer upload, "+err.error.error.message);
        }
      });
  }
}