import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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
    return this.http.post<Vaccine>(`${this.apiUrl}/vacinas`, vaccine);
  }

  uppdateVaccine() {}
}
