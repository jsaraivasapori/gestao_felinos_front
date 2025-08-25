import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../../../enviroments/environment';
import { VaccinetionCreate } from '../../../models/vacinaModel/vaccinate';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import {
  AplicacaoVacina,
  ProtocoloVacinal,
  StatusCiclo,
  VacinacaoKpis,
} from '../../../models/vacinaModel/vacina';

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
