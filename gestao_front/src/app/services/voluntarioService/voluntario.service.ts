import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/environment';
import {
  Voluntario,
  VoluntarioCreate,
} from '../../models/voluntarioModel/voluntario-model';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VoluntarioService {
  apiUrl = `${environment.API_URL}`;
  private voluntarioSubject = new BehaviorSubject<Voluntario[]>([]);
  public voluntario$ = this.voluntarioSubject.asObservable();
  constructor(private http: HttpClient) {
    this.getVoluntarios();
  }

  getVoluntarios() {
    this.http.get<Voluntario[]>(`${this.apiUrl}/voluntario`).subscribe({
      next: (dados) => this.voluntarioSubject.next(dados),
      error: (erro) => console.error('Erro ao carregar:', erro),
    });
  }

  createVoluntaraio(voluntario: VoluntarioCreate) {
    return this.http
      .post<Voluntario>(`${this.apiUrl}/voluntario`, voluntario)
      .pipe(
        tap((novoVoluntario) => {
          const listaAtual = this.voluntarioSubject.value;
          this.voluntarioSubject.next([...listaAtual, novoVoluntario]);
        })
      );
  }

  updateVoluntario(
    id: string,
    data: Partial<Voluntario>
  ): Observable<Voluntario> {
    return this.http
      .patch<Voluntario>(`${this.apiUrl}/voluntario/${id}`, data)
      .pipe(
        tap((voluntarioAtualziado) => {
          const listaAtual = this.voluntarioSubject.value;
          const listaAtualziada = listaAtual.map((voluntario) =>
            voluntario.id === id
              ? { ...voluntario, ...voluntarioAtualziado }
              : voluntario
          );
          this.voluntarioSubject.next(listaAtualziada);
        })
      );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/voluntario/${id}`).pipe(
      tap(() => {
        console.log('Antes:', this.voluntarioSubject.value);
        const novaLista = this.voluntarioSubject.value.filter(
          (voluntarioToDelete) => {
            return voluntarioToDelete.id !== id;
          }
        );
        console.log('Depois:', novaLista);
        this.voluntarioSubject.next(novaLista);
      })
    );
  }
}
