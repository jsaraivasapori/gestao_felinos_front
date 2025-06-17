import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { CardComponent } from '../../components/card/card.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { UsuarioService } from '../../services/usuarioService/usuario-service';
import { Subscription } from 'rxjs';
import { Usuario } from '../../models/usuarioModel/usuarios-model';
import { SnackBarNotificationService } from '../../services/snackBarNotification/snack-bar-notification.service';
import { MatInput, MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CardComponent,
    MatDividerModule,
    MatButtonModule,
    MatPaginatorModule,
    MatInput,
    MatInputModule,
  ],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsuariosComponent implements OnInit, OnDestroy {
  readonly dialog = inject(MatDialog);

  usuarios = signal<Usuario[]>([]); //fonte única de verdade, não alterar diretamente

  pageSize = 6;

  // Sinais para controle de paginação
  currentPage = signal(0);

  //Estado do filtro (o que o usuário digita)
  filtro = signal('');

  //Uma nova lista que reage a mudanças nos usuários OU no filtro

  usuariosFiltrados = computed(() => {
    const lista = this.usuarios();
    const termo = this.filtro().trim().toLowerCase();

    if (!termo) {
      return lista; // se o filtro estiver vazio, retorna a lista sem filtrar
    }

    //filtra pelo nome ou perfil do usuário
    return lista.filter((usuario) => {
      return (
        usuario.nome.toLowerCase().includes(termo) ||
        usuario.perfil.toLowerCase().trim().includes(termo)
      );
    });
  });

  // Usuários paginados (computado reativo)
  pagedUsuarios = computed(() => {
    const startIndex = this.currentPage() * this.pageSize;
    return this.usuariosFiltrados().slice(
      startIndex,
      startIndex + this.pageSize
    );
  });

  /**Objeto que ira guardar o retorno do método subiscribe() */
  private inscricaoUsuarios!: Subscription;

  constructor(
    private userService: UsuarioService,
    private snackBarService: SnackBarNotificationService
  ) {}

  ngOnInit(): void {
    this.inscricaoUsuarios = this.userService.usuario$.subscribe({
      next: (arrayUsuarios) => {
        this.usuarios.set(arrayUsuarios);
        console.log(this.usuarios);
      },
    });
  }

  ngOnDestroy(): void {
    //Se houver subscription, ocorrerá o unsubscribe. do contrario nada ocorre
    if (this.inscricaoUsuarios) {
      this.inscricaoUsuarios.unsubscribe();
    }
  }

  /**Método para deletar usuário */

  deleteUser(id: string) {
    this.userService.delete(id).subscribe({
      next: () => {
        this.snackBarService.showSucess('Sucesso');
      },
      error: (erro) => {
        console.error(erro);
        this.snackBarService.shoError('Erro');
      },
    });
  }

  /** Manipulador de mudança de página*/
  onPageChange(event: PageEvent) {
    this.currentPage.set(event.pageIndex);
  }

  /**Método para abir o dialog */
  openDialog(isEditing: boolean, data?: any) {
    this.dialog.open(UserDialogComponent, {
      height: '400px',
      width: '600px',
      data: { editMode: isEditing, ...data },
    });
  }

  handleFilterInput(event: Event) {
    const filteredValue = (event?.target as HTMLInputElement).value;
    this.filtro.set(filteredValue);
    // Voltar para a primeira página sempre que um filtro é aplicado
    this.currentPage.set(0);
  }
}
