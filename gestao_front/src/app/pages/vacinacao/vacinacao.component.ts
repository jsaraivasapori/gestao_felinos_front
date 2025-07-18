import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from '../../components/button/button.component';

@Component({
  selector: 'app-vacinacao',
  standalone: true,
  imports: [ButtonComponent],
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
