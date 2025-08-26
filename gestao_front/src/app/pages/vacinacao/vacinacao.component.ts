import { Component, inject, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { VacinacaoService } from '../../services/vacinaService/Vacinacao/vacinacao.service';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AplicarVacinaDialogComponent } from './dialog/aplicar-vacina-dialog/aplicar-vacina-dialog.component';
import {
  VacinacaoKpis,
  ProtocoloVacinal,
  AplicacaoVacina,
  StatusCiclo,
} from '../../models/vacinaModel/vacina';
import { DetalhesProtocoloDialogComponent } from './dialog/detalhes-protocolo-dialog/detalhes-protocolo-dialog.component';

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
    MatDialogModule,
  ],
  templateUrl: './vacinacao.component.html',
  styleUrl: './vacinacao.component.scss',
})
export class VacinacaoComponent implements OnInit {
  // O serviço continua injetado, mas não será usado para buscar dados nesta versão mockada.
  private vacinacaoService = inject(VacinacaoService);
  private dialog = inject(MatDialog); // Injete o MatDialog

  // Signals para o estado do componente
  isLoading = signal<boolean>(true);
  kpis = signal<VacinacaoKpis | null>(null);
  acoesUrgentes = signal<ProtocoloVacinal[]>([]);
  atividadesRecentes = signal<AplicacaoVacina[]>([]);
  proximosAgendamentos = signal<ProtocoloVacinal[]>([]);

  // Expõe o Enum para ser usado no template
  readonly StatusCicloEnum = StatusCiclo;
  // --- DADOS MOCKADOS ATUALIZADOS COM HISTÓRICO ---

  MOCK_KPIS: VacinacaoKpis = {
    aplicado: 132,
    agendado: 18,
    atrasados: 4,
    ciclosCompletos: 68,
  };

  MOCK_ACOES_URGENTES: ProtocoloVacinal[] = [
    {
      id: 'p1',
      status: StatusCiclo.ATRASADO,
      dataProximaVacina: '2025-08-15T12:00:00.000Z',
      felino: { id: 'f1', nome: 'Tom' },
      vacina: { id: 'v1', nome: 'V5 Felina (Reforço)' },
      dosesNecessarias: 3,
      intervaloEntreDosesEmDias: 21,
      requerReforcoAnual: true,
      // HISTÓRICO ADICIONADO:
      aplicacoes: [
        {
          id: 'app1-1',
          dataAplicacao: '2025-07-25T10:00:00.000Z',
          medVet: 'Dr. João Silva',
          lote: 'LOTE-A1',
          laboratorio: 'VetLab',
          valorPago: 50,
          protocoloVacinal: {} as any,
        },
      ],
    },
    {
      id: 'p2',
      status: StatusCiclo.EM_ANDAMENTO,
      dataProximaVacina: new Date().toISOString(),
      felino: { id: 'f2', nome: 'Frajola' },
      vacina: { id: 'v2', nome: 'Raiva' },
      dosesNecessarias: 1,
      intervaloEntreDosesEmDias: 0,
      requerReforcoAnual: true,
      // HISTÓRICO ADICIONADO: (vazio, pois é a primeira dose)
      aplicacoes: [],
    },
    {
      id: 'p3',
      status: StatusCiclo.EM_ANDAMENTO,
      dataProximaVacina: new Date(
        Date.now() + 3 * 24 * 60 * 60 * 1000
      ).toISOString(),
      felino: { id: 'f3', nome: 'Garfield' },
      vacina: { id: 'v1', nome: 'V5 Felina (Dose 2)' },
      dosesNecessarias: 3,
      intervaloEntreDosesEmDias: 21,
      requerReforcoAnual: true,
      // HISTÓRICO ADICIONADO:
      aplicacoes: [
        {
          id: 'app3-1',
          dataAplicacao: new Date(
            Date.now() - 18 * 24 * 60 * 60 * 1000
          ).toISOString(),
          medVet: 'Dra. Ana Costa',
          lote: 'LOTE-B2',
          laboratorio: 'PetMune',
          valorPago: 55,
          protocoloVacinal: {} as any,
        },
      ],
    },
  ];

  MOCK_ATIVIDADES_RECENTES: any[] = [
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

  MOCK_PROXIMOS_AGENDAMENTOS: ProtocoloVacinal[] = [
    {
      id: 'p4',
      status: StatusCiclo.EM_ANDAMENTO,
      dataProximaVacina: new Date(
        Date.now() + 15 * 24 * 60 * 60 * 1000
      ).toISOString(),
      felino: { id: 'f7', nome: 'Félix' },
      vacina: { id: 'v3', nome: 'V4 Felina (Dose 2)' },
      dosesNecessarias: 3,
      intervaloEntreDosesEmDias: 21,
      requerReforcoAnual: true,
      // HISTÓRICO ADICIONADO:
      aplicacoes: [
        {
          id: 'app4-1',
          dataAplicacao: new Date(
            Date.now() - 6 * 24 * 60 * 60 * 1000
          ).toISOString(),
          medVet: 'Dr. João Silva',
          lote: 'LOTE-C3',
          laboratorio: 'VetLab',
          valorPago: 60,
          protocoloVacinal: {} as any,
        },
        {
          id: 'app5-1',
          dataAplicacao: new Date(
            Date.now() - 6 * 24 * 60 * 60 * 1000
          ).toISOString(),
          medVet: 'Dr. João Silva',
          lote: 'LOTE-d56',
          laboratorio: 'VetLab',
          valorPago: 60,
          protocoloVacinal: {} as any,
        },
      ],
    },
    {
      id: 'p6',
      status: StatusCiclo.EM_ANDAMENTO,
      dataProximaVacina: new Date(
        Date.now() + 28 * 24 * 60 * 60 * 1000
      ).toISOString(),
      felino: { id: 'f9', nome: 'Bichento' },
      vacina: { id: 'v1', nome: 'V5 Felina (Dose 3)' },
      dosesNecessarias: 3,
      intervaloEntreDosesEmDias: 21,
      requerReforcoAnual: true,
      // HISTÓRICO ADICIONADO (com 2 doses já aplicadas):
      aplicacoes: [
        {
          id: 'app6-1',
          dataAplicacao: new Date(
            Date.now() - 14 * 24 * 60 * 60 * 1000
          ).toISOString(),
          medVet: 'Dra. Ana Costa',
          lote: 'LOTE-D4',
          laboratorio: 'PetMune',
          valorPago: 55,
          protocoloVacinal: {} as any,
        },
        {
          id: 'app6-2',
          dataAplicacao: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          ).toISOString(),
          medVet: 'Dra. Ana Costa',
          lote: 'LOTE-E5',
          laboratorio: 'PetMune',
          valorPago: 55,
          protocoloVacinal: {} as any,
        },
      ],
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
    const dialogRef = this.dialog.open(AplicarVacinaDialogComponent, {
      width: '500px',
      // Aqui passaríamos listas de felinos e vacinas para os selects
      data: { protocolo: null },
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        console.log('Dialog fechado com resultado:', resultado);
        // Aqui você chamaria o this.vacinacaoService.registrar(resultado)
        // E depois chamaria this.carregarDadosDoDashboard() para atualizar a tela
      }
    });
  }
  registrarDoseUrgente(protocolo: ProtocoloVacinal): void {
    const dialogRef = this.dialog.open(AplicarVacinaDialogComponent, {
      width: '500px',
      data: { protocolo: protocolo }, // Passa os dados do protocolo para o dialog
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        console.log('Dialog (urgente) fechado com resultado:', resultado);
        // Lógica idêntica à de cima para salvar e recarregar
      }
    });
  }

  openDialogCadastrarVacina(): void {
    console.log('Abrir modal para gerenciar o catálogo de vacinas...');
  }

  verDetalhes(protocolo: ProtocoloVacinal): void {
    // Precisamos de todos os dados, incluindo as aplicações.
    // O mock já deve ter, mas em uma chamada real, garanta que o backend os envie.

    this.dialog.open(DetalhesProtocoloDialogComponent, {
      width: '600px',
      data: protocolo, // Passa o objeto completo do protocolo para o dialog
    });
  }
}
