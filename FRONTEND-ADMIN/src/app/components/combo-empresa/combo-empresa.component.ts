import {
  Component,
  EventEmitter,
  Input,
  NgModule,
  Output,
  input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { EmpresaService } from '../../service/empresa.service';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ComboEmpresaService } from '../../service/combo-empresa.service';
import { error } from 'console';
import { ToastComponent } from '../toast/toast.component';
@Component({
  selector: 'app-combo-empresa',
  standalone: true,
  imports: [
    FormsModule,
    MultiSelectModule,
    InputGroupModule,
    InputGroupAddonModule,
  ],
  templateUrl: './combo-empresa.component.html',
  styleUrl: './combo-empresa.component.css',
})
export class ComboEmpresaComponent {
  @Output()
  idEmpresaCombo = new EventEmitter();
  items: any[] = [];

  selectedItems!: any[];

  selectAll = false;
  retornoApi$!: any;

  constructor(
    private empresaService: EmpresaService,
    private limparCombo: ComboEmpresaService,
    private valorCarregaCombo: ComboEmpresaService,
    private mensagem: ToastComponent
  ) {
    this.carregaEmpresaCombo();
  }

  ngOnInit(): void {
    this.retornoApi$ = this.limparCombo.limparCombo$.subscribe(() => {
      this.selectedItems = [];
    });

    this.retornoApi$ = this.valorCarregaCombo.valoresCombo$.subscribe(
      (data) => {
        if (data) {
          this.selectedItems = [data];
          //    console.log('data', data);
        }
      },
      (error) => {
        this.mensagem.toast(
          'error',
          'Erro no filtro de serie',
          'Token inválido, efetue o login novamente'
        );
      }
    );
  }

  onSelectAllChange(event: { checked: boolean }) {
    this.selectedItems = event.checked ? [...this.items] : [];
    this.selectAll = event.checked;
    console.log(this.selectedItems);
  }

  //CAPTURA DO VALOR DO COMBO
  onChangeCombo(event: { originalEvent: any; value: any }) {
    this.idEmpresaCombo.emit(event.value);
    const { originalEvent, value } = event;
    if (value) this.selectAll = value.length === this.items.length;
  }

  carregaEmpresaCombo() {
    this.retornoApi$ = this.empresaService.getEmpresa().subscribe(
      (data) => {
        if (Array.isArray(data)) {
          this.items = data.map((item: any) => ({
            idEmpresa: item.idEmpresa,
            descEmpresa: `${item.idEmpresa} - ${item.descEmpresa}`,
          }));
        } else {
          console.log('result2', JSON.parse(JSON.stringify(data)));
        }
      },
      (error) => {
        this.mensagem.toast(
          'error',
          'Erro',
        'Token inválido, efetue o login novamente'
        )
       
      }
    );
  }

  ngOnDestroy() {
    this.retornoApi$.unsubscribe();
  }
}
