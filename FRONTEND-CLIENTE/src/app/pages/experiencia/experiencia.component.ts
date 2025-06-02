import { Component, inject, OnInit } from '@angular/core';
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
import { ToastComponent } from '../../components/toast/toast.component';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ObservacaobottonComponent } from '../../components/observacaobotton/observacaobotton.component';
import { ExperienciaService } from '../../service/experiencia.service';
import { SessionStorageService } from '../../service/sessionlstorage.service';
import { HttpHeaders } from '@angular/common/http';
import { LoadingComponent } from '../../components/loading/loading.component';
import { ProgressbarComponent } from '../../components/progressbar/progressbar.component';
import { InputpreenchidoDirective } from '../../diretiva/inputpreenchido.directive';
@Component({
  selector: 'app-experiencia',
  standalone: true,
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
    ToastComponent,
    InputGroupModule,
    InputGroupAddonModule,
    ObservacaobottonComponent,
    LoadingComponent,
    ProgressbarComponent,
    InputpreenchidoDirective,
  ],
  templateUrl: './experiencia.component.html',
  styleUrl: './experiencia.component.css',
})
export class ExperienciaComponent implements OnInit {
  loading: boolean = false;
  cpf: any = this.sessionStorage.getLogin('cpf')?.replace(/\D/g, '');
  idcandidato: any = this.sessionStorage.getLogin('idcand');
  sessionToken: string | null = this.sessionStorage.getLogin('token');
  headers = new HttpHeaders({ Authorization: `Bearer ${this.sessionToken}` });
  isLoadingResults: boolean = false;
  showProgress: boolean = false;
  constructor(
    private breakpointObserver: BreakpointObserver,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private mensagem: ToastComponent,
    private experienciaService: ExperienciaService,
    private sessionStorage: SessionStorageService
  ) {}
  ngOnInit(): void {
    if (this.cpf || this.idcandidato) {
      console.log('cpf no inicio', this.cpf);
      this.getExperiencia(this.idcandidato, this.cpf);
    } else {
      console.error('CPF is null or undefined');
    }
  }
  experienciaForm = this.formBuilder.group({
    primeiroEmprego: ['', Validators.required],
    empresa: [''],
    cidade: [''],
    cargo: [''],
  });
  getExperiencia(idcandidato: string, cpf: string) {
    this.loading = true;
    this.experienciaService;
    let valores: any = { idcandidato: idcandidato, cpf: cpf };
    this.experienciaService.getExperiencia(valores, this.headers).subscribe({
      next: (response: any) => {
        console.log(
          'Experiência obtida com sucesso:',
          response[0][0].primeiroEmprego
        );

        this.experienciaForm.patchValue({
          primeiroEmprego: response[0][0]?.primeiroEmprego,
          empresa: response[0][0]?.empresa || '',
          cidade: response[0][0]?.cidade || '',
          cargo: response[0][0]?.cargo || '',
        });
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Erro ao obter experiência:', error);
        this.mensagem.toast('error', 'Erro', 'Erro ao obter experiência');
        this.loading = false;
        this.showProgress = true;
      },
    });
  }
  postExperiencia(valores: any) {
    this.loading = true;
    const cpf = this.sessionStorage.getLogin('cpf')?.replace(/\D/g, '');
    const idcandidato = this.sessionStorage.getLogin('idcand');

    const experienciaData = {
      ...valores,
      idcandidato,
      cpf,
    };

    console.log('experienciaData', experienciaData);
    this.experienciaService
      .postExperiencia(experienciaData, this.headers)
      .subscribe({
        next: (response: any) => {
          console.log('Experiência salva com sucesso:', response);
          this.mensagem.toast('success', 'Sucesso', 'Salva com sucesso');
          this.loading = false;

          if (valores.primeiroEmprego === 'S') {
            console.log('valor primeiro emprego:', valores.primeiroEmprego);
            this.experienciaForm.get('empresa')?.reset();
            this.experienciaForm.get('cidade')?.reset();
            this.experienciaForm.get('cargo')?.reset();
          }
        },
        error: (error: any) => {
          console.error('Erro ao salvar experiência:', error);
          this.mensagem.toast('error', 'Erro', 'Erro ao salvar');
          this.showProgress = true;
        },
      });
  }
}
