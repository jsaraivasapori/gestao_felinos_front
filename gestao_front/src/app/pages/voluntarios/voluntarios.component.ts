import { Component } from '@angular/core';
import { TableReOrderableColumnsComponent } from '../../components/table-re-orderable-columns/table-re-orderable-columns.component';
import { Router, ActivatedRoute } from '@angular/router';
import { FelinoService } from '../../services/felinoService/felino.service';
import { SharedService } from '../../services/shared.service';
import { Voluntario } from '../../models/voluntarioModel/voluntario-model';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-voluntarios',
  standalone: true,
  imports: [TableReOrderableColumnsComponent, MatButtonModule],
  templateUrl: './voluntarios.component.html',
  styleUrl: './voluntarios.component.scss',
})
export class VoluntariosComponent {
  showTable: boolean = true;
  data: any = [
    { nome: 'João Vitor', idade: 25, bairro: 'Todos os Santos Prolongamento' },
    { nome: 'Rosangela', idade: 51, bairro: 'Todos os Santos Prolongamento' },
  ];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private felinoService: FelinoService
  ) {}
  get isFormRoute(): boolean {
    return this.router.url === '/home/voluntarios/form';
  }

  toEditvolunteero(volunteerToEdit: Voluntario) {
    this.showTable = false;
    this.sharedService.setData('currentVolunteer', volunteerToEdit);
  }
  toDeletevolunteer(data: Voluntario) {
    //chamar modal de confirmação para apagar
    console.log('Estou deletando:', data);
  }
  addNewvolunteer(): void {
    this.sharedService.clearData('currentVolunteer');
  }
}
