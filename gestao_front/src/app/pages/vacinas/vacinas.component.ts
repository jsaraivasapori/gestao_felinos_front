import {
  ChangeDetectionStrategy,
  Component,
  computed,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { SnackBarNotificationService } from '../../services/snackBarNotification/snack-bar-notification.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule, MatInput } from '@angular/material/input';
import { CardComponent } from '../../components/card/card.component';
import { TableReOrderableColumnsComponent } from '../../components/table-re-orderable-columns/table-re-orderable-columns.component';
import { Subscription } from 'rxjs';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VacinasComponent implements OnInit, OnDestroy {
  // Sinal para o texto que o usuário digita no filtro
  filtro = signal('');

  // Sinal com a lista mestre, vinda da API
  vacinas = signal<Vaccine[]>([]);

  // ESTE É O SINAL QUE A UI VAI CONSUMIR
  // Ele reage a mudanças na lista principal OU no texto do filtro
  vacinasFiltradas = computed(() => {
    const lista = this.vacinas();
    const termo = this.filtro().toLowerCase().trim();

    if (!termo) {
      return lista;
    }
    return lista.filter((vacina) => {
      return vacina.nome.toLowerCase().includes(termo);
    });
  });

  private inscricaoVacinas!: Subscription;

  constructor(
    private sharedService: SharedService,
    private dialog: MatDialog,
    private vacinasService: VacinaService,
    private snackBarService: SnackBarNotificationService
  ) {}

  ngOnInit(): void {
    this.inscricaoVacinas = this.vacinasService.vacina$.subscribe({
      next: (arrayVacinas) => {
        this.vacinas.set(arrayVacinas);
        console.log(arrayVacinas);
      },
    });
  }

  ngOnDestroy(): void {
    if (this.inscricaoVacinas) {
      this.inscricaoVacinas.unsubscribe();
    }
  }

  handleFilterInput(event: Event) {
    const filteredValue = (event.target as HTMLInputElement).value;
    this.filtro.set(filteredValue);
  }
  openDialogVaccine(isEditing: boolean, data?: any) {
    this.dialog.open(VacinaDialogComponent, {
      height: '300px',
      width: '400px',
      data: { editMode: isEditing, ...data },
    });
  }
  editarVacina(event: Event) {}
  deletarVacina(id: string) {}
}
