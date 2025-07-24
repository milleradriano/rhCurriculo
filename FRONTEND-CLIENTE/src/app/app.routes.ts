import { Routes } from '@angular/router';
import { PainelVagaComponent } from './pages/painelVaga/painelVaga.component';
import { CurriculoComponent } from './pages/curriculo/curriculo.component';
import { ResidenciaComponent } from './pages/residencia/residencia.component';
import { ExperienciaComponent } from './pages/experiencia/experiencia.component';
import { LoginComponent } from './pages/login/login.component';
import { MenuComponent } from './pages/menu/menu.component';
import { CadastroLoginComponent } from './pages/cadastro-login/cadastro-login.component';
import { TermoUsoComponent } from './pages/termo-uso/termo-uso.component';
import { RecuperaSenhaComponent } from './pages/recupera-senha/recupera-senha.component';
import { authGuard } from './service/auth.guard';
import { AlteraSenhaComponent } from './pages/altera-senha/altera-senha.component';
export const routes: Routes = [
  {
    path: '',
    component: PainelVagaComponent,
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
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
path:'recuperarSenha',
component:RecuperaSenhaComponent,
  },
  
  {
    path: 'menu',       
    component: MenuComponent,
    // pathMatch: 'full',
    canActivate: [authGuard],
    children: [
      {
        path: 'curriculo',
        component: CurriculoComponent,
        // pathMatch: 'full',
      },
      {
        path: 'residencia',
        component: ResidenciaComponent,
        // pathMatch: 'full',
      },
  
      {
        path: 'experiencia',
        component: ExperienciaComponent,
        // pathMatch: 'full',
      },
      {
        path: 'modificarsenha',
        component: AlteraSenhaComponent,
        // pathMatch: 'full',
      },
       { path: '', redirectTo: 'curriculo', pathMatch: 'full' }, // rota padrão do menu
    ],
  },
{
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  }
];
