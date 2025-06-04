import { Component } from '@angular/core';
import { TableReOrderableColumnsComponent } from '../../components/table-re-orderable-columns/table-re-orderable-columns.component';
import { Router, ActivatedRoute, RouterOutlet } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { Voluntario } from '../../models/voluntarioModel/voluntario-model';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-voluntarios',
  standalone: true,
  imports: [TableReOrderableColumnsComponent, MatButtonModule, RouterOutlet],
  templateUrl: './voluntarios.component.html',
  styleUrl: './voluntarios.component.scss',
})
export class VoluntariosComponent {
  data: any = [
    { nome: 'João Vitor', idade: 25, bairro: 'Todos os Santos Prolongamento' },
    { nome: 'Rosangela', idade: 51, bairro: 'Todos os Santos Prolongamento' },
  ];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sharedService: SharedService
  ) {}
  /**
   * Metodo getter que retorna true se estiver na rota de formulario
   */
  get isFormRoute(): boolean {
    return this.router.url === '/home/voluntarios/form';
  }

  toEditVolunteero(volunteerToEdit: Voluntario) {
    this.sharedService.setData('currentVolunteer', volunteerToEdit);
    this.router.navigate(['form'], { relativeTo: this.route });
  }
  toDeleteVolunteer(data: Voluntario) {
    //chamar modal de confirmação para apagar
    // alem de passar o id passar o nome do voluntario
    console.log('Estou deletando:', data);
  }
  addNewVolunteer(): void {
    this.sharedService.clearData('currentVolunteer');
  }
}
