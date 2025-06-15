import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import {
  Usuario,
  UsuarioCreate,
} from '../../models/usuarioModel/usuarios-model';

@Injectable({
  providedIn: 'root',
})
export class UsuarioServiceService {
  apiUrl = `${environment.API_URL}`;

  private usuariosSubject = new BehaviorSubject<Usuario[]>([]);
  public usuario$ = this.usuariosSubject.asObservable();

  constructor(private http: HttpClient) {}

  getUsuarios() {
    this.http.get<Usuario[]>(`${this.apiUrl}/usuario`).subscribe({
      next: (dados) => this.usuariosSubject.next(dados),
      error: (erro) => console.error('Erro ao carregar: ', erro),
    });
  }

  createUsuario(usuario: UsuarioCreate): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/usuario`, usuario).pipe(
      tap((novoUsuario) => {
        const listaAtual = this.usuariosSubject.value;
        this.usuariosSubject.next([...listaAtual, novoUsuario]);
      })
    );
  }

  updateUsuario(id: string, data: Partial<Usuario>): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.apiUrl}/usuario/${id}`, data).pipe(
      tap((usuarioAtualizado) => {
        const listaAtual = this.usuariosSubject.value;
        const listaAtualizada = this.usuariosSubject.value.map((usuario) => {
          return usuario.id === id
            ? { ...usuario, ...usuarioAtualizado }
            : usuario;
        });
      })
    );
  }

  deleteUusuario(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/usuario/${id}`).pipe(
      tap(() => {
        const novaLista = this.usuariosSubject.value.filter(
          (usuarioToDelete) => {
            return usuarioToDelete.id !== id;
          }
        );
        this.usuariosSubject.next(novaLista);
      })
    );
  }
}
