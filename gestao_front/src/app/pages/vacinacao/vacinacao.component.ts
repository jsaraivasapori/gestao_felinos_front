import {
  Component,
  computed,
  inject,
  signal,
  WritableSignal,
} from '@angular/core';
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
  router = inject(Router);
  private breakpointObserver = inject(BreakpointObserver);
  activedRoute = inject(ActivatedRoute);
  readonly dialog = inject(MatDialog);
  // --- LÓGICA DE RESPONSIVIDADE ---
  private isHandset$ = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map((result) => result.matches));
  isMobile = toSignal(this.isHandset$, { initialValue: false });

  // --- GERENCIAMENTO DE DADOS ---
  // Fonte de verdade para os dados de vacinação
  dataSource: WritableSignal<any[]> = signal([
    {
      felino: 'Simba',
      vacina: 'V5 Felina',
      dataAplicacao: '2025-07-15',
      status: 'Aplicado',
    },
    {
      felino: 'Nala',
      vacina: 'Antirrábica',
      dataAplicacao: '2025-07-20',
      status: 'Agendado',
    },
    {
      felino: 'Mufasa',
      vacina: 'V5 Felina',
      dataAplicacao: '2025-06-01',
      status: 'Pendente',
    },
    {
      felino: 'Scar',
      vacina: 'Leucemia Felina',
      dataAplicacao: '2025-07-18',
      status: 'Confirmado',
    },
    {
      felino: 'Kiara',
      vacina: 'V5 Felina',
      dataAplicacao: '2025-07-18',
      status: 'Aplicado',
    },
    {
      felino: 'fsdd',
      vacina: '35 Felina',
      dataAplicacao: '2025-07-18',
      status: 'Aplicado',
    },
    {
      felino: 'nbv',
      vacina: 'V5 Felina',
      dataAplicacao: '2025-07-18',
      status: 'Aplicado',
    },
  ]);
  // Sinal para o valor do filtro de busca
  filterValue = signal('');
  // --- CONFIGURAÇÃO DA TABELA/CARDS ---
  columnsToDisplay = ['felino', 'vacina', 'dataAplicacao', 'status', 'action'];
  columnHeaders = {
    felino: 'Felino',
    vacina: 'Vacina',
    dataAplicacao: 'Data da Aplicação',
    status: 'Status',
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

  ngOnInit() {}

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
