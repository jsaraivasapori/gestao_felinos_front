import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../enviroments/environment';
import { VaccinetionCreate } from '../../../models/vacinaModel/vaccinate';

@Injectable({
  providedIn: 'root',
})
export class VacinacaoService {
  private apiUrl = environment.API_URL;
  constructor(private http: HttpClient) {}

  createVaccination(vaccination: VaccinetionCreate) {
    return this.http.post<VaccinetionCreate>(
      `${this.apiUrl}/vacinas/vacinacao`,
      vaccination
    );
  }
}
