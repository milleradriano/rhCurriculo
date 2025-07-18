import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TituloTopoService {
private tituloTopo = new BehaviorSubject<string>('Inicio');
titulo$ = this.tituloTopo.asObservable();
  constructor() { }
  setTituloTopo(titulo: string) {
    this.tituloTopo.next(titulo);    
  }
}
