import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Felino, FelinoCreate } from '../../models/felinoModel/felino-model';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../enviroments/environment';

@Injectable({
  providedIn: 'root',
})
export class FelinoService {
  apiUrl = `${environment.API_URL}`;
  private felinosSubject = new BehaviorSubject<Felino[]>([]);
  public felinos$ = this.felinosSubject.asObservable();

  constructor(private http: HttpClient) {
    this.getProducts(); // Carrega dados ao inicializar
  }

  getProducts() {
    this.http.get<Felino[]>(`${this.apiUrl}/felino`).subscribe({
      next: (dados) => this.felinosSubject.next(dados),
      error: (erro) => console.error('Erro ao carregar:', erro),
    });
  }
  createFelino(felino: FelinoCreate): Observable<Felino> {
    return this.http.post<Felino>(`${this.apiUrl}/felino`, felino).pipe(
      tap((novoFelino) => {
        const listaAtual = this.felinosSubject.value;
        this.felinosSubject.next([...listaAtual, novoFelino]);
      })
    );
  }
  updateFelino(id: string, data: Partial<Felino>): Observable<Felino> {
    return this.http.patch<Felino>(`${this.apiUrl}/felino/${id}`, data).pipe(
      tap((felinoAtualizado) => {
        //resposta do back ao fazer update

        const listaAtual = this.felinosSubject.value;
        const listaAtualizada = listaAtual.map((felino) =>
          felino.id === id ? { ...felino, ...felinoAtualizado } : felino
        );
        this.felinosSubject.next(listaAtualizada);
      })
    );
  }
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/felino/${id}`).pipe(
      tap(() => {
        const novaLista = this.felinosSubject.value.filter(
          (felino) => felino.id != id
        );
        this.felinosSubject.next(novaLista);
      })
    );
  }
}
