import { Component, Input, OnDestroy, Output, Inject, PLATFORM_ID, inject,OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';

import { VagasService } from '../../service/vagas.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { interfaceVaga} from '../../interface/vaga';
import { HttpClientModule } from '@angular/common/http';

import {  DialogModule } from 'primeng/dialog';

import { trigger, state, style, transition, animate } from '@angular/animations';
import { SessionstorageService } from '../../service/sessionlstorage.service';
import { Router } from '@angular/router';


import {
  DialogService,
  DynamicDialogModule,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { TopoComponent } from "../../components/topo/topo.component";
import { MenuComponent } from "../menu/menu.component";

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
    MenuComponent
],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [style({ opacity: 0 }), animate(300)]),
      transition(':leave', [animate(300, style({ opacity: 0 }))]),
    ]),
  ],
  providers: [VagasService, DialogService],
  templateUrl: './vagas.component.html',
  styleUrl: './vagas.component.css',
})
export class VagasComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();
  vagas: interfaceVaga[] = [];
  errorMessage: string = '';
  loading: boolean = false;
  visible: boolean = false;

  
  logo: any;
  vaga!: string ;
  descempresa!: string ;
  nomevaga!: string ;
  descvaga!: string ;
  desccidade!: string ;
  informacao_contrato!: string ;
  requisito!: string ;
  experiencia!: string ;
  totalVagas!: number;
  escolaridade!: string ;
 
  constructor(
    private vagasService: VagasService,
    public dialogService: DialogService,
    private storage: SessionstorageService,
    private router: Router
  ) {}
  ref: DynamicDialogRef | undefined;

  ngOnInit(): void {
    this.getVagas();
  }

  getVagas(): void {
    this.loading = true;

    this.subscription.add(
      this.vagasService.getVagas().subscribe({
        next: (data: interfaceVaga[]) => {
          this.vagas = data;
          // console.log('Vagas carregadas:', this.vagas);
          this.totalVagas = this.vagas.length;
          
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = `Erro ao carregar vagas: ${error.message}`;
          console.error('Erro:', error);
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        },
      })
    );
  }

  mostraVaga(dadosVaga: object):void {
    this.visible = true;
     console.log('Vaga mostrada:', JSON.parse(JSON.stringify(( dadosVaga))).nomevaga);
     this.nomevaga = JSON.parse(JSON.stringify(( dadosVaga))).nomevaga;
     this.descvaga = JSON.parse(JSON.stringify(( dadosVaga))).descvaga;
     this.desccidade = JSON.parse(JSON.stringify(( dadosVaga))).desccidade;
     this.informacao_contrato = JSON.parse(JSON.stringify(( dadosVaga))).informacao_contrato;
     this.descempresa = JSON.parse(JSON.stringify(( dadosVaga))).descempresa;
     this.logo = JSON.parse(JSON.stringify(( dadosVaga))).logo;
     this.requisito = JSON.parse(JSON.stringify(( dadosVaga))).requisito;
     this.experiencia = JSON.parse(JSON.stringify(( dadosVaga))).experiencia;
     this.escolaridade = JSON.parse(JSON.stringify(( dadosVaga))).escolaridade;
}

curriculoBotaoModal(){
  
  this.curriculo(this.storage.getCurriculo());
}
curriculo(id: any){ 

   this.storage.setCurriculo('id', id);
   this.router.navigate(['/login']);
   
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
