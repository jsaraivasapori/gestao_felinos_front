import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  tap,
  catchError,
  throwError,
  of,
} from 'rxjs';
import { Vaccine, VaccineCreate } from '../../models/vacinaModel/vacina';
import { environment } from '../../../enviroments/environment';

@Injectable({ providedIn: 'root' })
export class VacinaService {
  private apiUrl = environment.API_URL;
  private vacinasSubject = new BehaviorSubject<Vaccine[]>([]);
  public vacinas$ = this.vacinasSubject.asObservable();

  constructor(private http: HttpClient) {
    // A chamada inicial foi removida do construtor.
  }

  // ==============================================================================
  // MÉTODOS PÚBLICOS
  // ==============================================================================

  /**
   * Busca as vacinas da API, se ainda não tiverem sido carregadas.
   * Retorna o Observable para que o componente possa tratar o carregamento e os erros.
   */
  loadInitialVaccines(): Observable<Vaccine[]> {
    // Evita recarregar os dados se a lista já tiver itens.
    if (this.vacinasSubject.value.length > 0) {
      return of(this.vacinasSubject.value); // Retorna os dados já existentes
    }

    return this.http.get<Vaccine[]>(`${this.apiUrl}/vacinas`).pipe(
      tap((dados) => {
        this.sortAndEmit(dados);
      }),
      catchError((err) => {
        console.error('Erro ao carregar vacinas:', err);
        // Deixa o erro fluir para que o componente possa tratá-lo.
        return throwError(() => err);
      })
    );
  }

  /** Cria uma nova vacina, atualiza o estado local e retorna o Observable. */
  createVaccine(vaccine: VaccineCreate): Observable<Vaccine> {
    return this.http.post<Vaccine>(`${this.apiUrl}/vacinas`, vaccine).pipe(
      tap((novaVacina) => {
        const listaAtual = [...this.vacinasSubject.value, novaVacina];
        this.sortAndEmit(listaAtual);
      })
    );
  }

  /** Atualiza uma vacina, atualiza o estado local e retorna o Observable. */
  updateVaccine(id: string, data: Partial<Vaccine>): Observable<Vaccine> {
    return this.http.patch<Vaccine>(`${this.apiUrl}/vacinas/${id}`, data).pipe(
      tap((vacinaAtualizada) => {
        const listaAtual = this.vacinasSubject.value.map((vacina) =>
          vacina.id === id ? { ...vacina, ...vacinaAtualizada } : vacina
        );
        this.sortAndEmit(listaAtual);
      })
    );
  }

  /** Deleta uma vacina, atualiza o estado local e retorna o Observable. */
  deleteVaccine(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/vacinas/${id}`).pipe(
      tap(() => {
        const novaLista = this.vacinasSubject.value.filter(
          (vacina) => vacina.id !== id
        );
        this.sortAndEmit(novaLista);
      })
    );
  }

  // ==============================================================================
  // MÉTODO PRIVADO AUXILIAR
  // ==============================================================================

  /**
   * Ordena uma lista de vacinas pelo nome e a emite para o BehaviorSubject.
   * @param vacinas A lista de vacinas a ser ordenada e emitida.
   */
  private sortAndEmit(vacinas: Vaccine[]): void {
    const ordenadas = [...vacinas].sort((a, b) =>
      a.nome.localeCompare(b.nome, 'pt', { sensitivity: 'base' })
    );
    this.vacinasSubject.next(ordenadas);
  }
}
