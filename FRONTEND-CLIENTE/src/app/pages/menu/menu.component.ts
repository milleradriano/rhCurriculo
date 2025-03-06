import { Component, inject } from '@angular/core';
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
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    PanelMenuModule,
  ],
})
export class MenuComponent {
  private breakpointObserver = inject(BreakpointObserver);
  items: MenuItem[] = [];
  constructor(private httpClient: HttpClient) {
    this.items = [
      {
        label: 'Cadastro',
        icon: 'pi pi-desktop',
        items: [
            {
                label: 'Empresa',
                icon: 'pi pi-mobile',
                routerLink: 'empresa'
            },
            {
                label: 'Vagas',
                icon: 'pi pi-desktop',
                routerLink: 'cadvaga'
            },
            {
                label: 'Configurações',
                icon: 'pi pi-tablet'
            }
        ]
    },
   
      {
        label: 'Dados Pessoais',
        icon: 'pi pi-fw pi-building',
        routerLink: 'curriculo',
      },
 
      {
        label: 'Dados Residenciais',
        icon: 'pi pi-fw pi-building',
        routerLink: 'residencia',
      },

      {
        label: 'Experiência Profissional',
        icon: 'pi pi-fw pi-building',
        routerLink: 'experiencia',
      },
    ];
  }

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );
}
