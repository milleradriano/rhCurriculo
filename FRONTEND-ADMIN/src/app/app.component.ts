import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopoComponent } from "./components/topo/topo.component";
import { MenuComponent } from "./pages/menu/menu.component";
import { ToastModule } from "primeng/toast";





@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TopoComponent, MenuComponent, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
 
})
export class AppComponent {
  title = 'rhcurriculo';

}
