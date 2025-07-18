import { Routes } from '@angular/router';
import { VagasComponent } from './pages/painelVagas/painelVagas.component';
import { LoginComponent } from './pages/login/login.component';
import { MenuComponent } from './pages/menu/menu.component';
import { EmpresaComponent } from './pages/empresa/empresa.component';
import { CadastroVagaComponent } from './pages/cadastro-vaga/cadastro-vaga.component';
export const routes: Routes = [
  {
    path: 'vagas',
    component: VagasComponent,
    pathMatch: 'full',
  },
  {
    path: '',
    component: MenuComponent,
    children: [
      {
        path: 'empresa',
        component: EmpresaComponent,
      },
      {
        path: 'cadvaga',
        component: CadastroVagaComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
        pathMatch: 'full',
      },
    ],
  },
];
