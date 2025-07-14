import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Felino,
  FelinoCreate,
  FelinoInfoBasic,
} from '../../models/felinoModel/felino-model';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { environment } from '../../../enviroments/environment';

@Injectable({ providedIn: 'root' })
export class FelinoService {
  private apiUrl = environment.API_URL;
  private felinosSubject = new BehaviorSubject<Felino[]>([]);
  public felinos$ = this.felinosSubject.asObservable();

  /** Stream de id+nome sempre ordenado */
  public felinoOnlyNameAndId$ = this.felinos$.pipe(
    map((felinos) =>
      felinos
        .map((f) => ({ id: f.id, nome: f.nome } as FelinoInfoBasic))
        .sort((a, b) =>
          a.nome.localeCompare(b.nome, 'pt', { sensitivity: 'base' })
        )
    )
  );

  constructor(private http: HttpClient) {
    this.loadAllFelinos();
  }

  /** Carrega a lista inicial e emite ordenada */
  loadAllFelinos(): void {
    this.http.get<Felino[]>(`${this.apiUrl}/felino`).subscribe({
      next: (dados) => {
        const ordenados = [...dados].sort((a, b) =>
          a.nome.localeCompare(b.nome, 'pt', { sensitivity: 'base' })
        );
        this.felinosSubject.next(ordenados);
      },
      error: (err) => console.error('Erro ao carregar felinos', err),
    });
  }

  /** Cria um felino e emite lista sempre ordenada */
  createFelino(felino: FelinoCreate): Observable<Felino> {
    return this.http.post<Felino>(`${this.apiUrl}/felino`, felino).pipe(
      tap((novoFelino) => {
        const listaAtual = [...this.felinosSubject.value, novoFelino];
        const ordenados = listaAtual.sort((a, b) =>
          a.nome.localeCompare(b.nome, 'pt', { sensitivity: 'base' })
        );
        this.felinosSubject.next(ordenados);
      })
    );
  }

  /** Atualiza um felino e emite lista sempre ordenada */
  updateFelino(id: string, data: Partial<Felino>): Observable<Felino> {
    return this.http.patch<Felino>(`${this.apiUrl}/felino/${id}`, data).pipe(
      tap((felinoAtualizado) => {
        const listaAtualizada = this.felinosSubject.value
          .map((f) => (f.id === id ? { ...f, ...felinoAtualizado } : f))
          .sort((a, b) =>
            a.nome.localeCompare(b.nome, 'pt', { sensitivity: 'base' })
          );
        this.felinosSubject.next(listaAtualizada);
      })
    );
  }

  /** Deleta um felino e emite lista sempre ordenada */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/felino/${id}`).pipe(
      tap(() => {
        const novaLista = this.felinosSubject.value
          .filter((f) => f.id !== id)
          .sort((a, b) =>
            a.nome.localeCompare(b.nome, 'pt', { sensitivity: 'base' })
          );
        this.felinosSubject.next(novaLista);
      })
    );
  }
}
