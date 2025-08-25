// src/app/dialogs/aplicar-vacina-dialog/aplicar-vacina-dialog.component.ts

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, startWith, map, take } from 'rxjs'; // <-- ADICIONADO 'take'

// Material Imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';

// Seus Serviços e Interfaces
import { VacinaService } from '../../../../services/vacinaService/vacina.service';
import {
  ProtocoloVacinal,
  Vaccine,
} from '../../../../models/vacinaModel/vacina';
import { FelinoService } from '../../../../services/felinoService/felino.service';
import { Felino } from '../../../../models/felinoModel/felino-model';

export interface AplicarVacinaDialogData {
  protocolo?: ProtocoloVacinal;
}

@Component({
  selector: 'app-aplicar-vacina-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatDividerModule,
  ],
  templateUrl: './aplicar-vacina-dialog.component.html',
  styleUrls: ['./aplicar-vacina-dialog.component.scss'],
})
export class AplicarVacinaDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private vacinaService = inject(VacinaService);
  private felinosService = inject(FelinoService);
  public dialogRef = inject(MatDialogRef<AplicarVacinaDialogComponent>);
  public data: AplicarVacinaDialogData = inject(MAT_DIALOG_DATA);

  form!: FormGroup;
  isSaving = signal(false);

  vacinaInputCtrl = new FormControl<string | Vaccine>('');
  catalogoVacinas = signal<Vaccine[]>([]);
  filteredVacinas$!: Observable<Vaccine[]>;

  felinoInputCtrl = new FormControl<string | Felino>('');
  catalogoFelinos = signal<Felino[]>([]);
  filteredFelinos$!: Observable<Felino[]>;

  ngOnInit(): void {
    this.form = this.fb.group({
      felinoId: [this.data?.protocolo?.felino.id || null, Validators.required],
      vacinaId: [this.data?.protocolo?.vacina.id || null, Validators.required],
      laboratorio: ['', Validators.required],
      lote: ['', Validators.required],
      medVet: ['', Validators.required],
      valorPago: [0, [Validators.required, Validators.min(0)]],
      dosesNecessarias: [
        this.data?.protocolo?.dosesNecessarias || 1,
        Validators.required,
      ],
      intervaloEntreDosesEmDias: [
        this.data?.protocolo?.intervaloEntreDosesEmDias || 0,
      ],
      requerReforcoAnual: [this.data?.protocolo?.requerReforcoAnual || false],
    });

    if (this.data.protocolo) {
      this.vacinaInputCtrl.setValue(this.data.protocolo.vacina);
      this.vacinaInputCtrl.disable();
      this.felinoInputCtrl.setValue(this.data.protocolo.felino);
      this.felinoInputCtrl.disable();
    } else {
      this.carregarCatalogos(); // A chamada continua aqui
      this.filteredVacinas$ = this.vacinaInputCtrl.valueChanges.pipe(
        startWith(''),
        map((value) =>
          this._filter(value || '', this.catalogoVacinas(), 'nome')
        )
      );
      this.filteredFelinos$ = this.felinoInputCtrl.valueChanges.pipe(
        startWith(''),
        map((value) =>
          this._filter(value || '', this.catalogoFelinos(), 'nome')
        )
      );
    }
  }

  // =====================================================================
  // MÉTODO ATUALIZADO
  // =====================================================================
  private carregarCatalogos(): void {
    // Dispara o carregamento inicial das vacinas.
    // O subscribe aqui é só para saber quando terminou, mas os dados
    // serão emitidos pelo .vacinas$
    this.vacinaService.loadInitialVaccines().subscribe();
    this.felinosService.loadAllFelinos(); // O seu FelinoService já faz subscribe interno.

    // Agora nos inscrevemos nos Observables públicos para receber os dados
    this.vacinaService.vacinas$.subscribe((vacinas) => {
      console.log('Catálogo de VACINAS recebido:', vacinas);
      this.catalogoVacinas.set(vacinas);
    });
    this.felinosService.felinos$.subscribe((felinos) => {
      console.log('Catálogo de FELINOS recebido:', felinos);
      this.catalogoFelinos.set(felinos);
    });
  }

  // Função de filtro genérica (sem alterações)
  private _filter<T extends { [key: string]: any }>(
    value: string | T,
    list: T[],
    property: string
  ): T[] {
    const filterValue = (
      typeof value === 'string' ? value : value[property]
    ).toLowerCase();
    return list.filter((item) =>
      item[property].toLowerCase().includes(filterValue)
    );
  }

  // Funções Auxiliares para Autocomplete (sem alterações)
  displayFn(item: Vaccine | Felino): string {
    return item && item.nome ? item.nome : '';
  }

  onVacinaSelected(event: MatAutocompleteSelectedEvent): void {
    this.form.get('vacinaId')?.setValue((event.option.value as Vaccine).id);
  }

  onFelinoSelected(event: MatAutocompleteSelectedEvent): void {
    this.form.get('felinoId')?.setValue((event.option.value as Felino).id);
  }

  // Salvar e Cancelar (sem alterações)
  salvar(): void {
    if (this.form.invalid) return;
    this.isSaving.set(true);
    setTimeout(() => {
      this.dialogRef.close(this.form.value);
    }, 1000);
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}
