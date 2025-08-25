import { Component, computed, inject, OnInit, signal } from '@angular/core';
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
import { forkJoin } from 'rxjs';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// src/app/core/interfaces/protocolo.interface.ts

// Enum para corresponder ao backend
export enum StatusCiclo {
  PENDENTE = 'PENDENTE',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  ATRASADO = 'ATRASADO',
  COMPLETO = 'COMPLETO',
}

// Interfaces simplificadas para o frontend
export interface Felino {
  id: string;
  nome: string;
}

export interface Vacina {
  id: string;
  nome: string;
}

export interface AplicacaoVacina {
  id: string;
  dataAplicacao: string; // ISO Date String
  medVet: string;
  protocoloVacinal: {
    felino: Felino;
    vacina: Vacina;
  };
}

export interface ProtocoloVacinal {
  id: string;
  status: StatusCiclo;
  dataProximaVacina?: string; // ISO Date String
  dataLembreteProximoCiclo?: string; // ISO Date String
  felino: Felino;
  vacina: Vacina;
}

// Para os cards de status (KPIs)
export interface VacinacaoKpis {
  aplicado: number;
  agendado: number;
  atrasados: number;
  ciclosCompletos: number;
}
@Component({
  selector: 'app-vacinacao',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    MatListModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './vacinacao.component.html',
  styleUrl: './vacinacao.component.scss',
})
export class VacinacaoComponent implements OnInit {
  // O serviço continua injetado, mas não será usado para buscar dados nesta versão mockada.
  private vacinacaoService = inject(VacinacaoService);

  // Signals para o estado do componente
  isLoading = signal<boolean>(true);
  kpis = signal<VacinacaoKpis | null>(null);
  acoesUrgentes = signal<ProtocoloVacinal[]>([]);
  atividadesRecentes = signal<AplicacaoVacina[]>([]);
  proximosAgendamentos = signal<ProtocoloVacinal[]>([]);

  // Expõe o Enum para ser usado no template
  readonly StatusCicloEnum = StatusCiclo;

  // --- DADOS MOCKADOS (SIMULADOS) ---
  private MOCK_KPIS: VacinacaoKpis = {
    aplicado: 132,
    agendado: 18,
    atrasados: 4,
    ciclosCompletos: 68,
  };
  private MOCK_ACOES_URGENTES: ProtocoloVacinal[] = [
    {
      id: 'p1',
      status: StatusCiclo.ATRASADO,
      dataProximaVacina: '2025-08-15T12:00:00.000Z',
      felino: { id: 'f1', nome: 'Tom' },
      vacina: { id: 'v1', nome: 'V5 Felina (Reforço)' },
    },
    {
      id: 'p2',
      status: StatusCiclo.EM_ANDAMENTO,
      dataProximaVacina: new Date().toISOString(),
      felino: { id: 'f2', nome: 'Frajola' },
      vacina: { id: 'v2', nome: 'Raiva' },
    },
    {
      id: 'p3',
      status: StatusCiclo.EM_ANDAMENTO,
      dataProximaVacina: new Date(
        Date.now() + 3 * 24 * 60 * 60 * 1000
      ).toISOString(),
      felino: { id: 'f3', nome: 'Garfield' },
      vacina: { id: 'v1', nome: 'V5 Felina (Dose 2)' },
    },
  ];
  private MOCK_ATIVIDADES_RECENTES: AplicacaoVacina[] = [
    {
      id: 'a1',
      dataAplicacao: new Date().toISOString(),
      medVet: 'Dra. Ana Costa',
      protocoloVacinal: {
        felino: { id: 'f4', nome: 'Simba' },
        vacina: { id: 'v3', nome: 'V4 Felina (Dose 1)' },
      },
    },
    {
      id: 'a2',
      dataAplicacao: new Date(
        Date.now() - 1 * 24 * 60 * 60 * 1000
      ).toISOString(),
      medVet: 'Dr. João Silva',
      protocoloVacinal: {
        felino: { id: 'f5', nome: 'Luna' },
        vacina: { id: 'v1', nome: 'V5 Felina (Dose 3 - Final)' },
      },
    },
    {
      id: 'a3',
      dataAplicacao: new Date(
        Date.now() - 3 * 24 * 60 * 60 * 1000
      ).toISOString(),
      medVet: 'Dra. Ana Costa',
      protocoloVacinal: {
        felino: { id: 'f6', nome: 'Mimo' },
        vacina: { id: 'v2', nome: 'Raiva (Dose Única)' },
      },
    },
  ];
  private MOCK_PROXIMOS_AGENDAMENTOS: ProtocoloVacinal[] = [
    {
      id: 'p4',
      status: StatusCiclo.EM_ANDAMENTO,
      dataProximaVacina: new Date(
        Date.now() + 15 * 24 * 60 * 60 * 1000
      ).toISOString(),
      felino: { id: 'f7', nome: 'Félix' },
      vacina: { id: 'v3', nome: 'V4 Felina (Dose 2)' },
    },
    {
      id: 'p5',
      status: StatusCiclo.COMPLETO,
      dataLembreteProximoCiclo: new Date(
        Date.now() + 25 * 24 * 60 * 60 * 1000
      ).toISOString(),
      felino: { id: 'f8', nome: 'Misty' },
      vacina: { id: 'v2', nome: 'Raiva (Reforço Anual)' },
    },
  ];

  ngOnInit(): void {
    this.carregarDadosMockados();
  }

  /**
   * Carrega os dados mockados diretamente nos signals do componente,
   * simulando uma chamada de API com setTimeout.
   */
  carregarDadosMockados(): void {
    this.isLoading.set(true);

    // Simula uma espera de 1 segundo (1000ms) antes de mostrar os dados
    setTimeout(() => {
      this.kpis.set(this.MOCK_KPIS);
      this.acoesUrgentes.set(this.MOCK_ACOES_URGENTES);
      this.atividadesRecentes.set(this.MOCK_ATIVIDADES_RECENTES);
      this.proximosAgendamentos.set(this.MOCK_PROXIMOS_AGENDAMENTOS);
      this.isLoading.set(false);
    }, 1000);
  }

  // A versão original que busca dados reais do serviço.
  // Mantenha-a comentada para usar quando for conectar ao backend.
  /*
   carregarDadosDoDashboard(): void {
     this.isLoading.set(true);
     forkJoin({
       kpis: this.vacinacaoService.getKpis(),
       urgentes: this.vacinacaoService.getAcoesUrgentes(),
       recentes: this.vacinacaoService.getAtividadesRecentes(),
       agendamentos: this.vacinacaoService.getProximosAgendamentos(),
     }).subscribe({
       next: (resultados) => {
         this.kpis.set(resultados.kpis);
         this.acoesUrgentes.set(resultados.urgentes);
         this.atividadesRecentes.set(resultados.recentes);
         this.proximosAgendamentos.set(resultados.agendamentos);
         this.isLoading.set(false);
       },
       error: (err) => {
         console.error('Erro ao carregar dados do dashboard de vacinas', err);
         this.isLoading.set(false);
       },
     });
   }
   */

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

  aplicarNovaVacina(): void {
    console.log('Abrir modal/página para aplicar nova vacina...');
  }

  openDialogCadastrarVacina(): void {
    console.log('Abrir modal para gerenciar o catálogo de vacinas...');
  }
}
