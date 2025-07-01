import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Vaccine, VaccineCreate } from '../../models/vacinaModel/vacina';
import { environment } from '../../../enviroments/environment';

@Injectable({
  providedIn: 'root',
})
export class VacinaService {
  private apiUrl = `${environment.API_URL}`;

  private vacinasSubject = new BehaviorSubject<Vaccine[]>([]);
  public vacina$ = this.vacinasSubject.asObservable();
  constructor(private http: HttpClient) {
    this.getVaccines();
  }

  getVaccines() {
    return this.http.get<Vaccine[]>(`${this.apiUrl}/vacinas`).subscribe({
      next: (dados) => this.vacinasSubject.next(dados),
      error: (erro) => console.error('Erro ao carregar'),
    });
  }

  createVaccine(vaccine: VaccineCreate) {
    return this.http.post<Vaccine>(`${this.apiUrl}/vacinas`, vaccine).pipe(
      tap((novaVacina) => {
        const listaAtual = this.vacinasSubject.value;
        this.vacinasSubject.next([...listaAtual, novaVacina]);
      })
    );
  }

  uppdateVaccine(id: string, data: Partial<Vaccine>): Observable<Vaccine> {
    return this.http.patch<Vaccine>(`${this.apiUrl}/vacinas/${id}`, data).pipe(
      tap((vacinaAtualizada) => {
        const listaAtual = this.vacinasSubject.value;
        const listaAtualziada = listaAtual.map((vacina) =>
          vacina.id === id ? { ...vacina, ...vacinaAtualizada } : vacina
        );
        this.vacinasSubject.next(listaAtualziada);
      })
    );
  }

  delete(id: string) {
    return this.http.delete<void>(`${this.apiUrl}/vacinas/${id}`).pipe(
      tap(() => {
        console.log('Antes:', this.vacinasSubject.value);
        const novaLista = this.vacinasSubject.value.filter(
          (voluntarioToDelete) => {
            return voluntarioToDelete.id !== id;
          }
        );
        console.log('Depois:', novaLista);
        this.vacinasSubject.next(novaLista);
      })
    );
  }
}
