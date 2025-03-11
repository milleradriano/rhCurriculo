import { Routes } from '@angular/router';
import { VagasComponent } from './pages/vagas/vagas.component';
import { CurriculoComponent } from './pages/curriculo/curriculo.component';
import { ResidenciaComponent } from './pages/residencia/residencia.component';
import { ExperienciaComponent } from './pages/experiencia/experiencia.component';
import { LoginComponent } from './pages/login/login.component';
import { MenuComponent } from './pages/menu/menu.component';
import { CadastroLoginComponent } from './pages/cadastro-login/cadastro-login.component';
import { TermoUsoComponent } from './pages/termo-uso/termo-uso.component';
export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    pathMatch: 'full',
  },
  {
    path: 'registroLogin',
    component: CadastroLoginComponent,
  },
  {
    path: 'termos',
    component: TermoUsoComponent,
  },
  
  {
    path: 'menu',
    component: MenuComponent,
    children: [
      {
        path: 'curriculo',
        component: CurriculoComponent,
        //pathMatch: 'full',
      },
      {
        path: 'residencia',
        component: ResidenciaComponent,
        //pathMatch: 'full',
      },
      {
        path: 'experiencia',
        component: ExperienciaComponent,
        //pathMatch: 'full',
      },
    ],
  },
];
