import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { SessionStorageService } from '../../service/sessionlstorage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nometopo',
  standalone: true,
  imports: [],
  templateUrl: './nometopo.component.html',
  styleUrl: './nometopo.component.css'
})
export class NometopoComponent implements OnInit, OnDestroy {
nomeCandidato: string = '';
@Output() nomeCandidatoChange = new EventEmitter<string>();
private subscription: Subscription = new Subscription();
  teste :string = sessionStorage.getItem('nome') || ''; 
constructor(  
  private sessionStorageService: SessionStorageService,
  private cdr: ChangeDetectorRef){}

ngOnInit(): void {
  console.log('teste ',this.teste);
     this.sessionStorageService.getUserName().subscribe( {
      next: (userName) => {
        console.log('User Name no top:', userName);
      this.nomeCandidato = "Seja bem vindo, " + (userName || '');
          this.nomeCandidatoChange.emit(this.nomeCandidato);
      },
      error: (error) => {
        console.error('Erro ao obter o nome do usuário:', error);
      },
      complete: () => {
        console.log('Obtenção do nome do usuário concluida.');
      }
 });
  } 
  ngOnDestroy(): void {
    // Limpa a subscrição para evitar vazamentos de memória
    this.subscription.unsubscribe();
    console.log('Componente NometopoComponent destruído.');
  }
} 
  