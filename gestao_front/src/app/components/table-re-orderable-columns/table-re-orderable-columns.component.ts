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
  @Input() dataSource!: any[] | Voluntario[];
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
  }

  ngAfterViewInit() {
    // Conecta o paginador ao dataSource
    this.matDataSource.paginator = this.paginator;
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
