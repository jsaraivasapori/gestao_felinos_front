import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Voluntario } from '../../models/voluntarioModel/voluntario-model';
@Component({
  selector: 'app-table-re-orderable-columns',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    MatTooltipModule,
    MatPaginator,
    MatPaginatorModule,
    MatSortModule,
    CdkDropList,
    CdkDrag,
  ],
  templateUrl: './table-re-orderable-columns.component.html',
  styleUrl: './table-re-orderable-columns.component.scss',
})
export class TableReOrderableColumnsComponent
  implements OnInit, AfterViewInit, OnChanges
{
  // DataSource interno para a tabela Material para funcionar o paginator

  matDataSource = new MatTableDataSource<any>([]);
  @Input() filterValue: string = '';
  @Input()
  dataSource!: any[];
  @Input() columnsToDisplay: string[] = [];
  @Input() columnHeaders: { [key: string]: string } = {};
  @Output() editElement = new EventEmitter<any>();
  @Output() deleteElement = new EventEmitter<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    // Inicializa com os dados atuais
    this.matDataSource.data = this.dataSource;
  }

  ngAfterViewInit() {
    // Conecta o paginador ao dataSource
    this.matDataSource.paginator = this.paginator;
    this.paginatorLabelConfig(this.paginator);
    this.matDataSource.sort = this.sort;

    //passa os parametros de forma automatica ao clicar no header da coluna
    this.matDataSource.sortingDataAccessor = (
      data: any,
      sortHeaderId: string
    ) => {
      const value = data[sortHeaderId];

      // Trata apenas colunas de texto e passa ao sort as strings
      // minisculas para ordenar internamente sem alterar os valores iniciais
      if (typeof value === 'string') {
        return value.toLowerCase();
      }

      return value; //Dados não-string são mantidos originais
    };

    // Se já houver dados iniciais
    if (this.dataSource) {
      this.matDataSource.data = this.dataSource;
    }
    this.applyFilter('');
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Atualiza o dataSource interno quando o input mudar
    if (changes['dataSource']) {
      this.matDataSource.data = this.dataSource;

      // Reconecta o paginador e sort se já estiver inicializado
      if (this.paginator) {
        this.matDataSource.paginator = this.paginator;
      }
      if (this.sort) {
        this.matDataSource.sort = this.sort;
      }
    }
    //Atualiza o filtro na tabela quando ouver mudança no input filterValue
    if (changes['filterValue']) {
      console.log('Filtro recebido no filho:', this.filterValue);
      this.applyFilter(this.filterValue);
    }
  }

  private applyFilter(filterValue: string) {
    // Configura o predicate apenas na primeira chamada
    if (!this.matDataSource.filterPredicate) {
      this.matDataSource.filterPredicate = (data: any, filter: string) => {
        const dataStr = Object.keys(data)
          .reduce((acc, key) => acc + (data[key] || '').toString(), '')
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase();
        return dataStr.includes(filter);
      };
    }

    this.matDataSource.filter = filterValue.trim().toLowerCase();

    if (this.matDataSource.paginator) {
      this.matDataSource.paginator.firstPage();
    }
  }

  private paginatorLabelConfig(paginator: MatPaginator) {
    paginator._intl.firstPageLabel = 'Primeira página';
    paginator._intl.lastPageLabel = 'Última página';
    paginator._intl.itemsPerPageLabel = 'Itens por página';
    paginator._intl.nextPageLabel = 'Próxima página';
    paginator._intl.previousPageLabel = 'Página anterior';
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.columnsToDisplay,
      event.previousIndex,
      event.currentIndex
    );
  }

  toEdit(element: any): void {
    //Emite os dados da linha para editar no componente pai
    this.editElement.emit(element);
  }

  toDelete(element: any): void {
    //Emite os dados da linha para excluir
    this.deleteElement.emit(element);
  }
}
