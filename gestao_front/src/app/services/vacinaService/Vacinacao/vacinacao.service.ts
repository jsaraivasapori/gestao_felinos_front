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

  constructor(private http: HttpClient) {}

  createVaccination(vaccination: VaccinetionCreate) {
    return this.http.post<VaccinetionCreate>(
      `${this.apiUrl}/vacinas/registrar`,
      vaccination
    );
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
    return this.http.get<ProtocoloVacinal[]>(`${this.apiUrl}/vacinas/alertas`);
  }

  /**
   * Busca as últimas 5 doses de vacinas aplicadas.
   */
  getAtividadesRecentes(): Observable<AplicacaoVacina[]> {
    // Crie este endpoint no seu backend!
    return this.http.get<AplicacaoVacina[]>(
      `${this.apiUrl}/vacinas/ultimas-aplicacoes`
    );
  }

  /**
   * Busca os próximos agendamentos de reforços anuais.
   */
  getProximosAgendamentos(): Observable<ProtocoloVacinal[]> {
    return this.http.get<ProtocoloVacinal[]>(
      `${this.apiUrl}/vacinas/reforcos-anauais`
    );
  }
}
