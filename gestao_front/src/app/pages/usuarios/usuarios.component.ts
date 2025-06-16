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
import { Observable, Subscription } from 'rxjs';
import { Usuario } from '../../models/usuarioModel/usuarios-model';
import { SnackBarNotificationService } from '../../services/snackBarNotification/snack-bar-notification.service';

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
export class UsuariosComponent implements OnInit, OnDestroy {
  readonly dialog = inject(MatDialog);

  usuarios = signal<Usuario[]>([]);

  pageSize = 6;

  // Sinais para controle de paginação
  currentPage = signal(0);

  // Usuários paginados (computado reativo)
  pagedUsuarios = computed(() => {
    const startIndex = this.currentPage() * this.pageSize;
    return this.usuarios().slice(startIndex, startIndex + this.pageSize);
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
}
