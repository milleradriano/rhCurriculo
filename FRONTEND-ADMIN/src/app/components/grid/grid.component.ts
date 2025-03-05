
import {
  Component,
  Input,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
//import { ValoresDoGridParaFormService } from '../../service/valores-do-grid-para-form.service';
/** Constants used to fill up our data base. */

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    CommonModule,
    NgFor,
    FormsModule,
  ],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.css',
})
export class GridComponent {
  @Input()
  titles: string[] = [];
  @Input()
  @Input()
  translatedTitles: { [key: string]: string } = {};
  @Input()
  datasourceGrid: MatTableDataSource<any>[] = [];
  datagrid = new MatTableDataSource<any>(this.titles);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @Output()
  eventoFilho = new EventEmitter();

  resultsLength = 5;
  isLoadingResults = true;
  isRateLimitReached = false;


  constructor() {}

  ngAfterViewInit() {
      this.atualizaGrid();   
  }

  ngOnChanges() {
    this.atualizaGrid();
  }
  getTranslatedTitle(column: string): string {
    return this.translatedTitles[column] || column;
  }

  atualizaGrid() {
    this.titles = Object.keys(this.translatedTitles);
   
   //verifica se o datasourceGrid tem valor 
   if(this.datasourceGrid){ 
    this.datagrid = new MatTableDataSource<any>(this.datasourceGrid);
    this.datagrid.paginator = this.paginator;
  
   }
  }

  filtrar(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datagrid.filter = filterValue.trim().toUpperCase();
    if (this.datagrid.paginator) {
      this.datagrid.paginator.firstPage();
    }
  }

  selecionar(valores: any) {
  //  console.log('dentro do selecionar', valores);
    this.eventoFilho.emit(valores);
  }
}
