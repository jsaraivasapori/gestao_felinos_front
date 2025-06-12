import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { CardComponent } from '../../components/card/card.component';
import { UsuarioCreate } from '../../models/usuarioModel/usuarios-model';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CardComponent,
    MatDividerModule,
    MatButtonModule,
    MatPaginatorModule,
  ],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsuariosComponent {
  usuarios: UsuarioCreate[] = [
    {
      nome: 'João Vitor',
      login: 'jvss',
      senha: '****',
      perfil: 'Administrador',
    },
    {
      nome: 'Rosangela',
      login: 'rosademinas',
      senha: '*****',
      perfil: 'Gerencial',
    },
    {
      nome: 'Pablo',
      login: 'pablodeminas',
      senha: '*****',
      perfil: 'Gerencial',
    },
    {
      nome: 'Pablo',
      login: 'pablodeminas',
      senha: '*****',
      perfil: 'Gerencial',
    },
    {
      nome: 'Pablo',
      login: 'pablodeminas',
      senha: '*****',
      perfil: 'Gerencial',
    },
    {
      nome: 'Pablo',
      login: 'pablodeminas',
      senha: '*****',
      perfil: 'Gerencial',
    },
    {
      nome: 'Pablo',
      login: 'pablodeminas',
      senha: '*****',
      perfil: 'Gerencial',
    },
  ];

  // Sinais para controle de paginação
  pageSize = 6;
  currentPage = signal(0);
  // Usuários paginados (computado reativo)
  pagedUsuarios = computed(() => {
    const startIndex = this.currentPage() * this.pageSize;
    return this.usuarios.slice(startIndex, startIndex + this.pageSize);
  });

  // Manipulador de mudança de página
  onPageChange(event: PageEvent) {
    this.currentPage.set(event.pageIndex);
  }
}
