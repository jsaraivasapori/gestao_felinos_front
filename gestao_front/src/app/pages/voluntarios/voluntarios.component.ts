import { Component, ElementRef, ViewChild } from '@angular/core';
import { TableReOrderableColumnsComponent } from '../../components/table-re-orderable-columns/table-re-orderable-columns.component';
import { Router, ActivatedRoute, RouterOutlet } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { Voluntario } from '../../models/voluntarioModel/voluntario-model';
import { MatButtonModule } from '@angular/material/button';
import { VoluntarioService } from '../../services/voluntarioService/voluntario.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SnackBarNotificationService } from '../../services/snackBarNotification/snack-bar-notification.service';
import { CardComponent } from '../../components/card/card.component';
import { MatInput, MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-voluntarios',
  standalone: true,
  imports: [
    TableReOrderableColumnsComponent,
    CardComponent,
    MatButtonModule,
    MatInputModule,
    MatInput,
    CommonModule,
    RouterOutlet,
  ],
  templateUrl: './voluntarios.component.html',
  styleUrl: './voluntarios.component.scss',
})
export class VoluntariosComponent {
  voluntarioReceiver$!: Observable<Voluntario[]>;
  @ViewChild('filterInput') filterInput!: ElementRef<HTMLInputElement>;
  currentFilter = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private voluntarioService: VoluntarioService,
    private snackBarService: SnackBarNotificationService
  ) {}

  ngOnInit() {
    this.voluntarioReceiver$ = this.voluntarioService.voluntario$;
  }

  /**
   * Metodo getter que retorna true se estiver na rota de formulario
   */
  get isFormRoute(): boolean {
    return this.router.url === '/home/voluntarios/form';
  }
  handleFilterInput() {
    const value = this.filterInput.nativeElement.value;
    console.log('No pai:', value);
    this.currentFilter = value; // Atualiza diretamente
  }
  toEditVolunteero(volunteerToEdit: Voluntario) {
    this.sharedService.setData('currentVolunteer', volunteerToEdit);
    this.router.navigate(['form'], { relativeTo: this.route });
  }
  toDeleteVolunteer(id: string) {
    this.voluntarioService.delete(id).subscribe({
      next: (data) => {
        console.log('Deletado:', data);
        this.snackBarService.showSucess('Sucesso');
      },
      error: (error) => {
        const erroHour = new Date();
        console.error(`Erro ocorreu as ${erroHour}. Tipo do erro: ${error}`);
        this.snackBarService.shoError('Operação não concluida');
      },
    });
  }
  addNewVolunteer(): void {
    this.sharedService.clearData('currentVolunteer');
    this.router.navigate(['form'], { relativeTo: this.route });
  }
}
