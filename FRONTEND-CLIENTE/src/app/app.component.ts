import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopoComponent } from "./components/topo/topo.component";
import { MenuComponent } from "./pages/menu/menu.component";
import { VagasComponent } from "./pages/vagas/vagas.component";
import { LoginComponent } from "./pages/login/login.component";
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'rh-curriculo-cliente';
}