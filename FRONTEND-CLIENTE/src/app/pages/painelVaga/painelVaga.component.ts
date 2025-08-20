import { Component, OnDestroy, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PainelVagaService } from '../../service/painel-vaga.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { interfaceVaga } from '../../interface/vaga';
import { HttpClientModule } from '@angular/common/http';
import { DialogModule } from 'primeng/dialog';
import {  trigger,  state,  style,  transition,  animate} from '@angular/animations';
import { SessionStorageService } from '../../service/sessionlstorage.service';
import { Router } from '@angular/router';
import { DialogService,  DynamicDialogModule,  DynamicDialogRef,} from 'primeng/dynamicdialog';
import { TopoComponent } from '../../components/topo/topo.component';
import { environment } from '../../../environments/environment.prod';
import { ToastService } from '../../service/toast.service';
import {MatCardModule} from '@angular/material/card';
@Component({
  selector: 'app-vagas',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    HttpClientModule,
    DynamicDialogModule,
    DialogModule,
    TopoComponent,
    MatCardModule
  ],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [style({ opacity: 0 }), animate(300)]),
      transition(':leave', [animate(300, style({ opacity: 0 }))]),
    ]),
  ],
  providers: [PainelVagaService, DialogService],
  templateUrl: './painelVaga.component.html',
  styleUrl: './painelVaga.component.css',
})
  export class PainelVagaComponent implements OnInit, OnDestroy {
atualizaCadastro() {
 this.router.navigate(['/login']);
}
  private subscription: Subscription = new Subscription();
  vagas: interfaceVaga[] = [];
  errorMessage: string = '';
  loading: boolean = false;
  visible: boolean = false; 
  displayModal: boolean = false;
  logo: any;
  vaga!: string;
  descempresa!: string;
  idvaga!: number;
  nomevaga!: any;
  descvaga!: string;
  desccidade!: string;
  info_contrato!: string;
  regime_contrato!: string;
  requisito!: string;
  experiencia!: string;
  totalVagas!: number;
  escolaridade!: string;
  beneficio!: string;
  horario!: string;
  observacao!: string;

  constructor(
    private painelVagaService: PainelVagaService,
    public dialogService: DialogService,
    private sessionStorage: SessionStorageService,
    private router: Router,
      private mensagem: ToastService,
  ) {}
  ref: DynamicDialogRef | undefined;

  ngOnInit(): void {
    this.sessionStorage.clear();
    this.getVagas();
  }
  url = environment.api;
  getVagas(): void {
    this.loading = true;

    this.painelVagaService.getCarregaPainelVaga().subscribe({
      next: (data: any) => {
        console.log('Vagas recebidas:', data[0]);
        this.vagas = data;
        this.totalVagas = this.vagas.length;
        this.loading = false;
      },
      error: (error: any) => {
        this.errorMessage = `Erro ao carregar vagas: ${error.message}`;
        
        console.error('Erro:', error);
        this.mensagem.erro('Erro ao carregar vagas: ' + error);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  mostraVaga(dadosVaga: object): void {
    this.visible = true;
    this.idvaga = JSON.parse(JSON.stringify(dadosVaga)).idvaga;
    this.nomevaga = JSON.parse(JSON.stringify(dadosVaga)).nomevaga;

    this.descvaga = JSON.parse(JSON.stringify(dadosVaga)).descvaga;
    this.desccidade = JSON.parse(JSON.stringify(dadosVaga))
      .desccidade.split('\n')
      .map((linha: any) => `⮚ ${linha}`)
      .join('\n');

    this.info_contrato = JSON.parse(JSON.stringify(dadosVaga))
      .info_contrato?.split('\n')
      .map((linha: any) => `⮚ ${linha}`)
      .join('\n');

    this.regime_contrato = JSON.parse(JSON.stringify(dadosVaga))
      .regime_contrato?.split('\n')
      .map((linha: any) => `⮚ ${linha}`)
      .join('\n');
    this.descempresa = JSON.parse(JSON.stringify(dadosVaga)).descempresa;

    this.requisito = JSON.parse(JSON.stringify(dadosVaga)).requisito;
    this.experiencia = JSON.parse(JSON.stringify(dadosVaga)).experiencia;
    this.escolaridade = JSON.parse(JSON.stringify(dadosVaga)).escolaridade;
    this.beneficio = JSON.parse(JSON.stringify(dadosVaga))
      .beneficio?.split('\n')
      .map((linha: any) => `⮚ ${linha}`)
      .join('\n');
    this.horario = JSON.parse(JSON.stringify(dadosVaga))
      .horario?.split('\n')
      .map((linha: any) => `⮚ ${linha}`)
      .join('\n');
    this.observacao = JSON.parse(JSON.stringify(dadosVaga))
      .observacao?.split('\n')
      .map((linha: any) => `⮚ ${linha}`)
      .join('\n');
  }

 
  curriculo(id: any) {  
    
    this.sessionStorage.setVaga('codvaga', id);
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
