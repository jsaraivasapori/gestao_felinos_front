import { Component, inject, OnInit } from '@angular/core';
import { DynamicFormComponent } from '../../../components/dynamic-from/dynamic-form.component';
import { FormField } from '../../../models/form-field';
import {
  Form,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { FelinoService } from '../../../services/felinoService/felino.service';
import { VacinaService } from '../../../services/vacinaService/vacina.service';
import { combineLatest, forkJoin, zip } from 'rxjs';
import { FelinoInfoBasic } from '../../../models/felinoModel/felino-model';
import { Vaccine } from '../../../models/vacinaModel/vacina';
import { CardComponent } from '../../../components/card/card.component';
import { ButtonComponent } from '../../../components/button/button.component';
import { BasicInputComponent } from '../../../components/inputs/basic-input/basic-input.component';
import { DatepickerComponent } from '../../../components/inputs/datepicker/datepicker.component';
import { SelectComponent } from '../../../components/inputs/select/select.component';
import { SlideToggleComponent } from '../../../components/inputs/slide-toggle/slide-toggle.component';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-form-vacinacao',
  standalone: true,
  imports: [
    CardComponent,
    ButtonComponent,
    BasicInputComponent,
    DatepickerComponent,
    SelectComponent,
    SlideToggleComponent,
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
  ],
  templateUrl: './form-vacinacao.component.html',
  styleUrl: './form-vacinacao.component.scss',
})
export class FormVacinacaoComponent implements OnInit {
  router = inject(Router);
  private felinoService = inject(FelinoService);
  private vacinaService = inject(VacinaService);
  private fb: FormBuilder = inject(FormBuilder);

  // formConfig: FormField[] = [];
  vacinacaoForm!: FormGroup;
  felinos: FelinoInfoBasic[] = [];
  vacinas: Vaccine[] = [];

  ngOnInit(): void {
    combineLatest([
      this.felinoService.felinoOnlyNameAndId$,
      this.vacinaService.vacinas$,
    ]).subscribe({
      next: ([felinos, vacinas]) => {
        this.felinos = felinos;
        this.vacinas = vacinas;
      },
      error: (err) => console.error(err),
    });

    this.vacinacaoForm = this.fb.group({
      felino: ['', Validators.required],
      vacina: ['', Validators.required],
      lote: ['', Validators.required],
      medVet: ['', Validators.required],
      valorPago: ['', [Validators.required, Validators.min(0.1)]],
      dosesNecessarias: [
        '',
        [Validators.required, Validators.pattern('^[1-9][0-9]*$')],
      ],
      dataProximaVacina: [new Date()],
      intervaloEntreDosesEmDias: ['', Validators.pattern('^[0-9][0-9]*$')],
      requerReforcoAnual: [false, Validators.required],
    });
  }

  /** Getter para usar no [control] dos inputs */
  get felino() {
    return this.vacinacaoForm.get('felino') as FormControl;
  }
  get vacina() {
    return this.vacinacaoForm.get('vacina') as FormControl;
  }
  get lote() {
    return this.vacinacaoForm.get('lote') as FormControl;
  }
  get medVet() {
    return this.vacinacaoForm.get('medVet') as FormControl;
  }
  get valorPago() {
    return this.vacinacaoForm.get('valorPago') as FormControl;
  }
  get dosesNecessarias() {
    return this.vacinacaoForm.get('dosesNecessarias') as FormControl;
  }
  get dataProximaVacina() {
    return this.vacinacaoForm.get('dataProximaVacina') as FormControl;
  }
  get intervaloEntreDosesEmDias() {
    return this.vacinacaoForm.get('intervaloEntreDosesEmDias') as FormControl;
  }
  get requerReforcoAnual() {
    return this.vacinacaoForm.get('requerReforcoAnual') as FormControl;
  }
  onFormSubmitted() {
    const formValue = this.vacinacaoForm.value;
    console.log(formValue);
    this.router.navigate(['home', 'vacinas']);
  }
  onCancel() {
    this.router.navigate(['home', 'vacinas']);
  }
}
