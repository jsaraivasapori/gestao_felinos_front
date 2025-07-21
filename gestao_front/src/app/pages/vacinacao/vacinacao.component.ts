import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from '../../components/button/button.component';
import { CardComponent } from '../../components/card/card.component';
import { MatIcon } from '@angular/material/icon';
import { TableReOrderableColumnsComponent } from '../../components/table-re-orderable-columns/table-re-orderable-columns.component';

@Component({
  selector: 'app-vacinacao',
  standalone: true,
  imports: [
    ButtonComponent,
    CardComponent,
    TableReOrderableColumnsComponent,
    MatIcon,
  ],
  templateUrl: './vacinacao.component.html',
  styleUrl: './vacinacao.component.scss',
})
export class VacinacaoComponent {
  router = inject(Router);
  activedRoute = inject(ActivatedRoute);
  aplicarNovaVacina() {
    this.router.navigate(['home', 'vacinacao']);
  }
}
