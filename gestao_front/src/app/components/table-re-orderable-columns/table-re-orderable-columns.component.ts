import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
@Component({
  selector: 'app-table-re-orderable-columns',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    MatTooltipModule,
    CdkDropList,
    CdkDrag,
  ],
  templateUrl: './table-re-orderable-columns.component.html',
  styleUrl: './table-re-orderable-columns.component.scss',
})
export class TableReOrderableColumnsComponent {
  @Input() dataSource = [];
  @Input() columnsToDisplay: string[] = [];
  @Input() columnHeaders: { [key: string]: string } = {};
  @Output() editElement = new EventEmitter<any>();
  @Output() deleteElement = new EventEmitter<any>();
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
