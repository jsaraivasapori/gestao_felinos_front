import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import {
  ProtocoloVacinal,
  StatusCiclo,
} from '../../../../models/vacinaModel/vacina';

@Component({
  selector: 'app-detalhes-protocolo-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
  ],
  templateUrl: './detalhes-protocolo-dialog.component.html',
  styleUrl: './detalhes-protocolo-dialog.component.scss',
})
export class DetalhesProtocoloDialogComponent {
  // Injeta os dados que foram passados ao abrir o dialog
  public protocolo: ProtocoloVacinal = inject(MAT_DIALOG_DATA);
  public dialogRef = inject(MatDialogRef<DetalhesProtocoloDialogComponent>);

  getStatusClass(status: StatusCiclo): string {
    switch (status) {
      case StatusCiclo.ATRASADO:
        return 'status-chip--atrasado';
      case StatusCiclo.EM_ANDAMENTO:
        return 'status-chip--em-andamento';
      case StatusCiclo.COMPLETO:
        return 'status-chip--completo';
      case StatusCiclo.PENDENTE:
        return 'status-chip--pendente';
      default:
        return '';
    }
  }

  fechar(): void {
    this.dialogRef.close();
  }
}
