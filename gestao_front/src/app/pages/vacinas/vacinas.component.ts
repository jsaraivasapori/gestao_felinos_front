import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { SnackBarNotificationService } from '../../services/snackBarNotification/snack-bar-notification.service';
import { VoluntarioService } from '../../services/voluntarioService/voluntario.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule, MatInput } from '@angular/material/input';
import { CardComponent } from '../../components/card/card.component';
import { TableReOrderableColumnsComponent } from '../../components/table-re-orderable-columns/table-re-orderable-columns.component';
import { Observable } from 'rxjs';
import { Vaccine } from '../../models/vacinaModel/vacina';

@Component({
  selector: 'app-vacinas',
  standalone: true,
  imports: [
    TableReOrderableColumnsComponent,
    CardComponent,
    MatButtonModule,
    MatInputModule,
    MatInput,
    CommonModule,
  ],
  templateUrl: './vacinas.component.html',
  styleUrl: './vacinas.component.scss',
})
export class VacinasComponent {
  vacinaReciver$!: Observable<Vaccine[]>;
  @ViewChild('filterInput') filterInput!: ElementRef<HTMLInputElement>;
  currentFilter = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private voluntarioService: VoluntarioService,
    private snackBarService: SnackBarNotificationService
  ) {}
  handleFilterInput() {
    const value = this.filterInput.nativeElement.value;
    console.log('No pai:', value);
    this.currentFilter = value; // Atualiza diretamente
  }
  addNewVaccine() {}
}
