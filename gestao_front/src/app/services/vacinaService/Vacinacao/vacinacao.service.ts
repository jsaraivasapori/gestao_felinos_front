import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../../../enviroments/environment';
import { VaccinetionCreate } from '../../../models/vacinaModel/vaccinate';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';

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

// --- DADOS MOCKADOS (SIMULADOS) ---

const MOCK_KPIS: VacinacaoKpis = {
  aplicado: 132,
  agendado: 18,
  atrasados: 4,
  ciclosCompletos: 68,
};

const MOCK_ACOES_URGENTES: ProtocoloVacinal[] = [
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
    dataProximaVacina: new Date().toISOString(), // Vence Hoje!
    felino: { id: 'f2', nome: 'Frajola' },
    vacina: { id: 'v2', nome: 'Raiva' },
  },
  {
    id: 'p3',
    status: StatusCiclo.EM_ANDAMENTO,
    dataProximaVacina: new Date(
      Date.now() + 3 * 24 * 60 * 60 * 1000
    ).toISOString(), // Vence em 3 dias
    felino: { id: 'f3', nome: 'Garfield' },
    vacina: { id: 'v1', nome: 'V5 Felina (Dose 2)' },
  },
];

const MOCK_ATIVIDADES_RECENTES: AplicacaoVacina[] = [
  {
    id: 'a1',
    dataAplicacao: new Date().toISOString(), // Hoje
    medVet: 'Dra. Ana Costa',
    protocoloVacinal: {
      felino: { id: 'f4', nome: 'Simba' },
      vacina: { id: 'v3', nome: 'V4 Felina (Dose 1)' },
    },
  },
  {
    id: 'a2',
    dataAplicacao: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Ontem
    medVet: 'Dr. João Silva',
    protocoloVacinal: {
      felino: { id: 'f5', nome: 'Luna' },
      vacina: { id: 'v1', nome: 'V5 Felina (Dose 3 - Final)' },
    },
  },
  {
    id: 'a3',
    dataAplicacao: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 dias atrás
    medVet: 'Dra. Ana Costa',
    protocoloVacinal: {
      felino: { id: 'f6', nome: 'Mimo' },
      vacina: { id: 'v2', nome: 'Raiva (Dose Única)' },
    },
  },
];
@Injectable({
  providedIn: 'root',
})
export class VacinacaoService {
  private apiUrl = environment.API_URL;
  readonly dataTable = signal<any[]>([]);

  constructor(private http: HttpClient) {
    this.getDataToTable();
  }

  getDataToTable() {
    return this.http.get<any[]>(`${this.apiUrl}/vacinas/vacinacao`).subscribe({
      next: (dados) => {
        const mappedData = dados.map((data) =>
          this.formatarRegistroVacinal(data)
        );
        this.dataTable.set(mappedData);
      },
      error: (erro) => console.error('Erro ao carregar', erro),
    });
  }
  createVaccination(vaccination: VaccinetionCreate) {
    return this.http
      .post<VaccinetionCreate>(`${this.apiUrl}/vacinas/vacinacao`, vaccination)
      .pipe(
        tap(() => {
          this.getDataToTable();
        })
      );
  }

  private formatarRegistroVacinal(data: any) {
    const date = new Date(data.dataAplicacao);
    const formattedDate = date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });

    return {
      felino: data.felino.nome,
      vacina: data.vacina.nome,
      dataAplicacao: formattedDate,
      protocoloVacinalStatus: data.protocoloVacinal.status.toLowerCase(),
      felinoId: data.felino.id,
      protocoloVacinalId: data.protocoloVacinal.id,
    };
  }

  /**
   * Busca os números consolidados para os cards de KPI do dashboard.
   * (Sugestão: Crie um endpoint no backend para isso para otimizar)
   */
  getKpis(): Observable<VacinacaoKpis> {
    // Provisoriamente, usaremos dados mockados. Substitua por uma chamada HTTP real.
    // return this.http.get<VacinacaoKpis>(`${this.apiUrl}/kpis`);
    return new Observable((observer) => {
      observer.next({
        aplicado: 128,
        agendado: 54,
        atrasados: 12,
        ciclosCompletos: 62,
      });
      observer.complete();
    });
  }

  /**
   * Busca os protocolos que exigem atenção imediata (atrasados ou vencendo em breve).
   */
  getAcoesUrgentes(): Observable<ProtocoloVacinal[]> {
    return this.http.get<ProtocoloVacinal[]>(`${this.apiUrl}/alertas`);
  }

  /**
   * Busca as últimas 5 doses de vacinas aplicadas.
   */
  getAtividadesRecentes(): Observable<AplicacaoVacina[]> {
    // Crie este endpoint no seu backend!
    return this.http.get<AplicacaoVacina[]>(
      `${this.apiUrl}/aplicacoes/recentes`
    );
  }

  /**
   * Busca os próximos agendamentos de reforços anuais.
   */
  getProximosAgendamentos(): Observable<ProtocoloVacinal[]> {
    return this.http.get<ProtocoloVacinal[]>(`${this.apiUrl}/reforcos-anuais`);
  }
}
