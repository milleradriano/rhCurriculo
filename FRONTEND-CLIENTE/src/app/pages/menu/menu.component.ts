import { ChangeDetectorRef, Component, EventEmitter, inject, Input, input, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { TopoComponent } from '../../components/topo/topo.component';
import { MenuItem } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { PanelMenuModule } from 'primeng/panelmenu';
import { SessionStorageService } from '../../service/sessionlstorage.service';
import { NometopoComponent } from '../../components/nometopo/nometopo.component';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
  standalone: true,
  providers: [NometopoComponent],
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    PanelMenuModule,
    NometopoComponent
]
})
export class MenuComponent implements OnInit {
sair() {
this.sessionStorageService.clear();
}
  private breakpointObserver = inject(BreakpointObserver);
  items: MenuItem[] = [];
 
 
  constructor(private httpClient: HttpClient, 
              private sessionStorageService: SessionStorageService,
              private cdr : ChangeDetectorRef,
              private nomeTopo: NometopoComponent) {  }
              
  ngOnInit(): void {

    this.sessionStorageService.getUserName().subscribe((userName) => {
    
    //this.nomeCandidato = "Seja bem vindo, " + this.sessionStorageService.getUserName() || '';
   
     this.cdr.detectChanges();
     });
   this.items = [
     
      {
        label: 'Dados Pessoais',
        icon: 'pi pi-fw pi-user',
        routerLink: 'curriculo',
      },
 
      {
        label: 'Dados Residenciais',
        icon: 'pi pi-fw pi-home',
        routerLink: 'residencia',
      },

      {
        label: 'Experiência Profissional',
        icon: 'pi pi-fw pi-building',
        routerLink: 'experiencia',
      },
        {
        label: 'Modificar Senha',
        icon: 'pi pi-fw pi-key',
        routerLink: 'modificarsenha',
      },
      //  {     
      //   label: 'Sair',
      //   icon: 'pi pi-fw pi-sign-out',
      //   routerLink: '/'
    
      // },
    ];
}

isHandset$: Observable<boolean> = this.breakpointObserver
  .observe(Breakpoints.Handset)
  .pipe(
    map((result) => result.matches),
    shareReplay()
  );
 
}
