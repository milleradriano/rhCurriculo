import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { ThemePalette } from '@angular/material/core';
export interface DialogData {
  
}

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css',
})
export class LoadingComponent {
  constructor(public dialog: MatDialog) {}
  color: ThemePalette = 'warn';
}

/* Como usar:
Deve-se:
 importar => import { LoadingComponent } from 'src/app/component/loading/loading.component';
 No imports => imports:[  LoadingComponent ]
 criar uma variavel => loading = false;
 no inicio da função setar =>  loading = true;
 no fim do processo setar =>  loading = false;
 no html criar o @if e criar a classe loading  =>
---------------
 @if ( loading){
  <div class="loading">
    
    <app-loading></app-loading>
  </div>
  }
------------------
No Css adicionar => 
.loading{  
  position: absolute;
  top: 0;
  left: 0;
  bottom: 56px;
  right: 0;
  background: rgba(0, 0, 0, 0.15);
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;  
  height: 100vh;
}

*/
