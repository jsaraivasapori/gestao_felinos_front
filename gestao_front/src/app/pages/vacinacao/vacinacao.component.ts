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
  private vacinacaoService = inject(VacinacaoService);
  private dialog = inject(MatDialog); // Injete o MatDialog

  // Signals para o estado do componente
  kpis = signal<VacinacaoKpis | null>(null);
  acoesUrgentes = signal<ProtocoloVacinal[]>([]);
  atividadesRecentes = signal<AplicacaoVacina[]>([]);
  proximosAgendamentos = signal<ProtocoloVacinal[]>([]);

  // Expõe o Enum para ser usado no template

  ngOnInit(): void {
    this.carregarDadosDoDashboard();
  }

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
        this.vacinacaoService.createVaccination(resultado).subscribe();
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

  private carregarDadosDoDashboard(): void {
    // Carrega os KPIs
    // this.vacinacaoService.getKpis().subscribe((kpis) => {
    //   this.kpis.set(kpis);
    // });

    // Carrega as ações urgentes
    this.vacinacaoService.getAcoesUrgentes().subscribe((protocolos) => {
      this.acoesUrgentes.set(protocolos);
    });

    // Carrega as atividades recentes
    this.vacinacaoService.getAtividadesRecentes().subscribe((atividades) => {
      this.atividadesRecentes.set(atividades);
    });

    // Carrega os próximos agendamentos

    this.vacinacaoService
      .getProximosAgendamentos()
      .subscribe((agendamentos) => {
        this.proximosAgendamentos.set(agendamentos);
      });
  }
}
