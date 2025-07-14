import { Component, inject, OnInit } from '@angular/core';
import { DynamicFormComponent } from '../../../components/dynamic-from/dynamic-form.component';
import { FormField } from '../../../models/form-field';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FelinoService } from '../../../services/felinoService/felino.service';
import { VacinaService } from '../../../services/vacinaService/vacina.service';
import { combineLatest, forkJoin, zip } from 'rxjs';
import { FelinoInfoBasic } from '../../../models/felinoModel/felino-model';
import { Vaccine } from '../../../models/vacinaModel/vacina';

@Component({
  selector: 'app-form-vacinacao',
  standalone: true,
  imports: [DynamicFormComponent],
  templateUrl: './form-vacinacao.component.html',
  styleUrl: './form-vacinacao.component.scss',
})
export class FormVacinacaoComponent implements OnInit {
  router = inject(Router);
  private felinoService = inject(FelinoService);
  private vacinaService = inject(VacinaService);

  formConfig: FormField[] = [];

  ngOnInit(): void {
    combineLatest([
      this.felinoService.felinoOnlyNameAndId$,
      this.vacinaService.vacinas$,
    ]).subscribe({
      next: ([felinos, vacinas]) => {
        this.formConfig = this.buildForm(felinos, vacinas);
      },
      error: (err) => console.error(err),
    });
  }
  onFormSubmitted(formValue: any) {
    console.log(formValue);
    this.router.navigate(['home', 'vacinas']);
  }
  onCancel() {
    this.router.navigate(['home', 'vacinas']);
  }

  private buildForm(
    felinos: FelinoInfoBasic[],
    vaccines: Vaccine[]
  ): FormField[] {
    return [
      {
        name: 'felino',
        label: 'Felino',
        type: 'select',
        options: felinos.map((f) => ({ value: f.id, label: f.nome })),
        validators: [Validators.required],
        errorMessages: { required: 'Campo obrigatório' },
      },
      {
        name: 'vacina',
        label: 'Vacina',
        type: 'select',
        options: vaccines.map((v) => ({ value: v.id, label: v.nome })),
        validators: [Validators.required],
        errorMessages: { required: 'Campo obrigatório' },
      },

      {
        name: 'lote',
        label: 'Lote',
        type: 'text',
        validators: [Validators.required],
        errorMessages: { required: 'Campo obrigatório' },
      },
      {
        name: 'medVet',
        label: 'Médico (a) veterinário (a)',
        type: 'text',
        validators: [Validators.required],
        errorMessages: { required: 'Campo obrigatório' },
      },
      {
        name: 'valorPago',
        label: 'Valor da vacina',
        type: 'text',
        validators: [Validators.required, Validators.min(0.1)],
        errorMessages: { required: 'Campo obrigatório', min: 'Valor inválido' },
      },
      {
        name: 'dosesNecessarias',
        label: 'Doses necessárias',
        type: 'text',
        validators: [Validators.required, Validators.pattern('^[1-9][0-9]*$')],
        errorMessages: {
          required: 'Campo obrigatório',
          pattern: 'Campo inválido',
        },
      },
      {
        name: 'DataProximaVacina',
        label: 'Próxima dose',
        type: 'datePicker',
      },
      {
        name: 'intervaloEntreDosesEmDias',
        label: 'Intervalo entre as doses em dias',
        type: 'text',
        validators: [Validators.pattern('^[0-9][0-9]*$')],
        errorMessages: { pattern: 'Campo inválido' },
      },
      {
        name: 'requerReforcoAnual',
        label: 'Reforço anaul',
        type: 'slide-toggle',
        validators: [Validators.required],
        errorMessages: { required: 'Campo obrigatório' },
      },
    ];
  }
}
