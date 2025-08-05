import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { ButtonComponent } from '../../components/button/button.component';
import { CardComponent } from '../../components/card/card.component';
import { MatIconModule } from '@angular/material/icon';
import { TableReOrderableColumnsComponent } from '../../components/table-re-orderable-columns/table-re-orderable-columns.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { FormNewVaccineComponent } from './form-new-vaccine/form-new-vaccine.component';
import { VacinacaoService } from '../../services/vacinaService/Vacinacao/vacinacao.service';
import { SnackBarNotificationService } from '../../services/snackBarNotification/snack-bar-notification.service';

@Component({
  selector: 'app-vacinacao',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    ButtonComponent,
    TableReOrderableColumnsComponent,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatPaginatorModule,
    MatDividerModule,
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './vacinacao.component.html',
  styleUrl: './vacinacao.component.scss',
})
export class VacinacaoComponent {
  private vacinacaoService = inject(VacinacaoService);
  private breakpointObserver = inject(BreakpointObserver);

  router = inject(Router);
  activedRoute = inject(ActivatedRoute);

  readonly dialog = inject(MatDialog);
  readonly dataSource = this.vacinacaoService.dataTable;

  // --- LÓGICA DE RESPONSIVIDADE ---
  private isHandset$ = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map((result) => result.matches));
  isMobile = toSignal(this.isHandset$, { initialValue: false });

  // --- GERENCIAMENTO DE DADOS ---
  // Fonte de verdade para os dados de vacinação

  // Sinal para o valor do filtro de busca
  filterValue = signal('');

  // --- CONFIGURAÇÃO DA TABELA/CARDS ---
  columnsToDisplay = [
    'felino',
    'vacina',
    'dataAplicacao',
    'protocoloVacinalStatus',
    'action',
  ];
  columnHeaders = {
    felino: 'Felino',
    vacina: 'Vacina',
    dataAplicacao: 'Data da Aplicação',
    protocoloVacinalStatus: 'Status',
    action: 'Ações',
  };

  // --- LÓGICA DE PAGINAÇÃO PARA OS CARDS ---
  pageSize = 3;
  currentPage = signal(0);

  // --- SINAIS COMPUTADOS PARA REATIVIDADE ---
  filteredDataSource = computed(() => {
    const data = this.dataSource();
    const filter = this.filterValue().trim().toLowerCase();
    if (!filter) return data;

    return data.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(filter)
      )
    );
  });

  pagedCardData = computed(() => {
    const items = this.filteredDataSource();
    const startIndex = this.currentPage() * this.pageSize;
    return items.slice(startIndex, startIndex + this.pageSize);
  });

  // --- MANIPULADORES DE EVENTOS ---
  handleFilter(event: Event) {
    const filter = (event.target as HTMLInputElement).value;
    this.filterValue.set(filter);
    this.currentPage.set(0); // Volta para a primeira página ao filtrar
  }

  onPageChange(event: PageEvent) {
    this.currentPage.set(event.pageIndex);
  }

  aplicarNovaVacina() {
    this.router.navigate(['home/vacinacao']);
  }

  onEdit(element: any) {
    console.log('Editar aplicação:', element);
  }

  onDelete(element: any) {
    console.log('Deletar aplicação:', element);
  }
  openDialogCadastrarVacina(): void {
    const dialogRef = this.dialog.open(FormNewVaccineComponent, {
      width: '300px',
      height: '300px',
      disableClose: true,
    });
  }
}
