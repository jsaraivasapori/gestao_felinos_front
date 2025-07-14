import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-vacinacao',
  standalone: true,
  imports: [MatButtonModule],
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
