
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
import { InputpreenchidoDirective } from '../../diretiva/inputpreenchido.directive';
import { CombopreenchidoDirective } from '../../diretiva/combopreenchido.directive';
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

  isLoadingResults: boolean = false;

  showProgress: boolean = false;
  
onChangeCombo($event: DropdownChangeEvent) {
console.log('onChangeCombo', $event);
}
  formBuilder = inject(FormBuilder);
  escolaridade: interfaceEscolaridade[] = [];
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
      { idEscolaridade: 1, descEscolaridade: 'Ensino Fundamental Incompleto' },
      { idEscolaridade: 2, descEscolaridade: 'Ensino Fundamental Completo' },
      { idEscolaridade: 3, descEscolaridade: 'Ensino Medio Completo Incompleto' },
      { idEscolaridade: 4, descEscolaridade: 'Ensino Medio Completo' },
      { idEscolaridade: 5, descEscolaridade: 'Ensino Superior Incompleto' },
      { idEscolaridade: 6, descEscolaridade: 'Ensino Superior Completo' },
    ];

    this.nomeTopoService.setTituloTopo('Cadastro de Vaga');
  }
  /* TITULO DO GRID*/
  title: string[] = ['idempresa', 'nomevaga','status', 'atualizar'];
  translatedTitles: { [key: string]: string } = {
    idempresa: 'Empresa',
    nomevaga: 'Descrição da Vaga',
    status: 'Status',
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

  postVaga(events$: any) {
    //adcionar usuario
    console.log('valores no post', events$);

    this.vagaService.postVaga(events$).subscribe({
      next: (valores: any) => {
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
      next: (data:any) => {
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
      error: (error:any) => {
        this.mensagem.erro(error);
      },
    });
  }

  carregaGrid() {
    this.isLoadingResults = true;
    this.vagaService.getVaga().subscribe({
      next: (data:any) => {
        if (Array.isArray(data)) {
          this.dataSourceGrid = data.map((item: any) => ({
            ...item,
            status: item.status ? 'Ativo' : 'Inativo',
          }));
          console.log('dentro do carregaGrid', this.dataSourceGrid);
        } else {
          this.dataSourceGrid = JSON.parse(JSON.stringify(data));
        }
      },
      error: (error:any) => {
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
recebeValores($event: any) {
  console.log('recebeValores', $event);
 
  this.vagaForm.patchValue({
    idVaga: $event.idvaga,
    nomeVaga: $event.nomevaga,
    status: $event.status === 'Ativo',
    descVaga: $event.descvaga,
    idEmpresa: $event.idempresa,
    escolaridade:$event.idescolaridade , // Se for um ID ou objeto, ajuste conforme necessário
    // idEscolaridade: $event.escolaridade ? this.escolaridade.find(item
    // escolaridade: $event.escolaridade, // Se for um ID ou objeto, ajuste conforme necessário
    // escolaridade: $event.escolaridade ? this.escolaridade.find(item => item
    experiencia: $event.experiencia,
    tipoContrato: $event.tipocontrato,
    beneficio: $event.beneficio,
    horario: $event.horario,
    observacao: $event.observacao
  });
}

  confirmaExclusao() {}
}
