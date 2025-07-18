import { Component, inject, Inject } from '@angular/core';
import { GridComponent } from '../../components/grid/grid.component';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';

import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { interfaceEscolaridade } from '../../interface/escolaridade';
import { TituloTopoService } from '../../service/titulo-topo.service';

import { VagasService } from '../../service/vaga.service';
import { ToastService } from '../../service/toast.service';
import { interfaceGetEmpresa } from '../../interface/empresa';
import { Console } from 'console';
import { EmpresaService } from '../../service/empresa.service';
import { InputpreenchidoDirective } from '../../diretivas/inputpreenchido.directive';
import { CombopreenchidoDirective } from '../../diretivas/combopreenchido.directive';
@Component({
  selector: 'app-cadastro-vaga',
  standalone: true,
  imports: [
    DropdownModule,
    InputTextModule,
    FormsModule,
    ButtonModule,
    GridComponent,
    ReactiveFormsModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputSwitchModule,
    InputTextareaModule,
    InputpreenchidoDirective,
    CombopreenchidoDirective
  ],
  templateUrl: './cadastro-vaga.component.html',
  styleUrl: './cadastro-vaga.component.css',
})
export class CadastroVagaComponent {
recebeValores($event: any) {
throw new Error('Method not implemented.');
}
  isLoadingResults: boolean = false;

  showProgress: boolean = false;
  
onChangeCombo($event: DropdownChangeEvent) {
console.log('onChangeCombo', $event);
}
  formBuilder = inject(FormBuilder);
  escolaridade: interfaceEscolaridade[];
  escolaridadeSelecionada: interfaceEscolaridade | undefined;
  empresaInterface: interfaceGetEmpresa[] = [];
  dataSourceGrid : any[] = [];
  empresaSelecionada: interfaceGetEmpresa | undefined;

  constructor(
    private nomeTopoService: TituloTopoService,
    private vagaService: VagasService,
    private mensagem: ToastService,
    private empresaService: EmpresaService
  ) {
    this.escolaridade = [
      { idEscolaridade: 1, escolaridade: 'Ensino Fundamental Incompleto' },
      { idEscolaridade: 2, escolaridade: 'Ensino Fundamental Completo' },
      { idEscolaridade: 3, escolaridade: 'Ensino Medio Completo Incompleto' },
      { idEscolaridade: 4, escolaridade: 'Ensino Medio Completo' },
      { idEscolaridade: 5, escolaridade: 'Ensino Superior Incompleto' },
      { idEscolaridade: 6, escolaridade: 'Ensino Superior Completo' },
    ];

    this.nomeTopoService.setTituloTopo('Cadastro de Vaga');
  }
  /* TITULO DO GRID*/
  title: string[] = ['idempresa', 'nomevaga', 'atualizar'];
  translatedTitles: { [key: string]: string } = {
    idempresa: 'Empresa',
    nomevaga: 'Descrição da Vaga',
    atualizar: 'Ação',
  };



  vagaForm = this.formBuilder.group({
    idVaga: [''],
    nomeVaga: ['',Validators.required],
    status: [true],
    descVaga: ['',Validators.required],
    idEmpresa: ['',Validators.required],
    escolaridade: ['',Validators.required],
    experiencia: ['',Validators.required],
    tipoContrato: ['',Validators.required],
    beneficio: ['',Validators.required],
    horario: ['',Validators.required],
    observacao: ['',Validators.required],
  });

  postVaga(valores: any) {
    //adcionar usuario
   
    this.vagaService.postVaga(valores).subscribe({
      next: (valores: any) => {
        console.log('valores', valores);
        this.mensagem.sucesso('Vaga cadastrada com sucesso');
        this.carregaGrid();
      },
      error: (error: any) => {
        console.log('error', error);
        this.mensagem.erro('Erro ao cadastrar vaga');
      },
    });
  }
  ngOnInit(): void {

    this.getEmpresa();
    this.carregaGrid();
  }

  getEmpresa() {
 
    this.empresaService.getEmpresa().subscribe({
      next: (data) => {
            console.log('getEmpresa',data);
           
        if (Array.isArray(data)) {
           this.empresaInterface = data.map((item: any) => ({
             ...item,
             descempresa: `${item.idempresa} - ${item.descempresa}`,
           }));

        } else {
          console.log('result2', JSON.parse(JSON.stringify(data)));
          this.mensagem.info('Nenhuma empresa cadastrada');
        }
      },
      error: (error) => {
        this.mensagem.erro(error);
      },
    });
  }

  carregaGrid() {
    this.isLoadingResults = true;
    this.vagaService.getVaga().subscribe({
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
          this.mensagem.erro(error);
          this.showProgress = true;
        } else {
          this.mensagem.erro(error);
        }
      },
    })
  }
  confirmaExclusao() {}
}
