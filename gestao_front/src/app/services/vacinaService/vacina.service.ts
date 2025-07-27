import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Vaccine, VaccineCreate } from '../../models/vacinaModel/vacina';
import { environment } from '../../../enviroments/environment';
import { VaccinetionCreate } from '../../models/vacinaModel/vaccinate';

@Injectable({ providedIn: 'root' })
export class VacinaService {
  private apiUrl = environment.API_URL;
  private vacinasSubject = new BehaviorSubject<Vaccine[]>([]);
  public vacinas$ = this.vacinasSubject.asObservable();

  constructor(private http: HttpClient) {
    this.getVaccines();
  }

  /**
   *                CRUD BÁSICO PARA VACINAS
   * ==============================================================================
   */
  /** Carrega e ordena ao inicializar */
  getVaccines() {
    this.http.get<Vaccine[]>(`${this.apiUrl}/vacinas`).subscribe({
      next: (dados) => {
        const ordenadas = [...dados].sort((a, b) =>
          a.nome.localeCompare(b.nome, 'pt', { sensitivity: 'base' })
        );
        this.vacinasSubject.next(ordenadas);
      },
      error: (err) => console.error('Erro ao carregar', err),
    });
  }

  /** Cria e emite lista ordenada */
  createVaccine(vaccine: VaccineCreate): Observable<Vaccine> {
    return this.http.post<Vaccine>(`${this.apiUrl}/vacinas`, vaccine).pipe(
      tap((novaVacina) => {
        const listaAtual = [...this.vacinasSubject.value, novaVacina];
        const ordenadas = listaAtual.sort((a, b) =>
          a.nome.localeCompare(b.nome, 'pt', { sensitivity: 'base' })
        );
        this.vacinasSubject.next(ordenadas);
      })
    );
  }

  /** Atualiza e emite lista ordenada */
  updateVaccine(id: string, data: Partial<Vaccine>): Observable<Vaccine> {
    return this.http.patch<Vaccine>(`${this.apiUrl}/vacinas/${id}`, data).pipe(
      tap((vacinaAtualizada) => {
        const listaAtual = this.vacinasSubject.value.map((vacina) =>
          vacina.id === id ? { ...vacina, ...vacinaAtualizada } : vacina
        );
        const ordenadas = listaAtual.sort((a, b) =>
          a.nome.localeCompare(b.nome, 'pt', { sensitivity: 'base' })
        );
        this.vacinasSubject.next(ordenadas);
      })
    );
  }

  /** Deleta e emite lista ordenada */
  deleteVaccine(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/vacinas/${id}`).pipe(
      tap(() => {
        const novaLista = this.vacinasSubject.value
          .filter((vacina) => vacina.id !== id)
          .sort((a, b) =>
            a.nome.localeCompare(b.nome, 'pt', { sensitivity: 'base' })
          );
        this.vacinasSubject.next(novaLista);
      })
    );
  }
}
