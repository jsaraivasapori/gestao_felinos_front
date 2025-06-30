import {
  Component,
  computed,
  ElementRef,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { SnackBarNotificationService } from '../../services/snackBarNotification/snack-bar-notification.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule, MatInput } from '@angular/material/input';
import { CardComponent } from '../../components/card/card.component';
import { TableReOrderableColumnsComponent } from '../../components/table-re-orderable-columns/table-re-orderable-columns.component';
import { Observable, Subscription } from 'rxjs';
import { Vaccine } from '../../models/vacinaModel/vacina';
import { MatDialog } from '@angular/material/dialog';
import { VacinaDialogComponent } from './vacina-dialog/vacina-dialog.component';
import { VacinaService } from '../../services/vacinaService/vacina.service';

@Component({
  selector: 'app-vacinas',
  standalone: true,
  imports: [
    TableReOrderableColumnsComponent,
    CardComponent,
    MatButtonModule,
    MatInputModule,
    MatInput,
    CommonModule,
  ],
  templateUrl: './vacinas.component.html',
  styleUrl: './vacinas.component.scss',
})
export class VacinasComponent implements OnInit {
  public filtro = signal('');
  public vacinas = signal<Vaccine[]>([]);

  @ViewChild('filterInput') filterInput!: ElementRef<HTMLInputElement>;

  constructor(
    private sharedService: SharedService,
    private dialog: MatDialog,
    private vacinasService: VacinaService,
    private snackBarService: SnackBarNotificationService
  ) {}

  ngOnInit(): void {}

  handleFilterInput() {}
  openDialogVaccine(isEditing: boolean, data?: any) {
    this.dialog.open(VacinaDialogComponent, {
      height: '300px',
      width: '400px',
      data: { editMode: isEditing, ...data },
    });
  }
}
