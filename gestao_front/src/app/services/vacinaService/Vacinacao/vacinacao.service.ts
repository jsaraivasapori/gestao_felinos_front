import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../../../enviroments/environment';
import { VaccinetionCreate } from '../../../models/vacinaModel/vaccinate';
import { BehaviorSubject, map, tap } from 'rxjs';

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
}
