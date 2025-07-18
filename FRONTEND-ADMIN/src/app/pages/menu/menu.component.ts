import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map,  take } from 'rxjs/operators';

import { MenuItem } from 'primeng/api';

import { PanelMenuModule } from 'primeng/panelmenu';
import { TituloTopoComponent } from "../../components/titulo-topo/titulo-topo.component";
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
    TituloTopoComponent
],
})
export class MenuComponent {
  private breakpointObserver = inject(BreakpointObserver);
  items: MenuItem[] = [];
  constructor() {
    this.items = [
  
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
    }
    

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      take(1)
    );
    
}
