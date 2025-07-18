import { ChangeDetectorRef, Component, EventEmitter, Output, output } from '@angular/core';
import { TituloTopoService } from '../../service/titulo-topo.service';

@Component({
  selector: 'app-titulo-topo',
  standalone: true,
  imports: [],
  templateUrl: './titulo-topo.component.html',
  styleUrl: './titulo-topo.component.css'
})
export class TituloTopoComponent {
tituloTopo: string = '';
@Output() tituloTopoChange = new EventEmitter<string>();
constructor(private cdr: ChangeDetectorRef,private tituloTopoService: TituloTopoService) {
this.tituloTopoService.titulo$.subscribe(titulo => this.tituloTopo = titulo);
}

}
