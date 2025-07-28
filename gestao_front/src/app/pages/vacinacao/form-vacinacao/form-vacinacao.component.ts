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
import { combineLatest, forkJoin, Subject, takeUntil, zip } from 'rxjs';
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
import { VacinacaoService } from '../../../services/vacinaService/Vacinacao/vacinacao.service';
import { SnackBarNotificationService } from '../../../services/snackBarNotification/snack-bar-notification.service';
import { S } from '@angular/cdk/keycodes';
import { VaccinetionCreate } from '../../../models/vacinaModel/vaccinate';

@Component({
  selector: 'app-form-vacinacao',
  standalone: true,
  imports: [
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
  private vacinacaoService = inject(VacinacaoService);
  private snackBarService = inject(SnackBarNotificationService);
  private destroy$ = new Subject<void>();

  // formConfig: FormField[] = [];
  vacinacaoForm!: FormGroup;
  felinos: FelinoInfoBasic[] = [];
  vacinas: Vaccine[] = [];

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
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
    console.log(this.felinos, this.vacinas);

    this.vacinacaoForm = this.buildForm();
    this.observarMudancasDoses();
  }

  buildForm(): FormGroup {
    return this.fb.group({
      felino: ['', Validators.required],
      vacina: ['', Validators.required],
      lote: ['', Validators.required],
      medVet: ['', Validators.required],
      valorPago: ['', [Validators.required, Validators.min(0.1)]],
      dosesNecessarias: ['', [Validators.pattern('^[1-9][0-9]*$')]],
      dataProximaVacina: [{ value: null, disabled: false }],
      intervaloEntreDosesEmDias: [
        { value: null, disabled: false },
        Validators.pattern('^[0-9][0-9]*$'),
      ],
      requerReforcoAnual: [false, Validators.required],
    });
  }
  private observarMudancasDoses(): void {
    // Usamos o getter que você já criou
    this.dosesNecessarias.valueChanges
      .pipe(
        takeUntil(this.destroy$) // Garante que a inscrição será finalizada quando o componente for destruído
      )
      .subscribe((doses) => {
        // Converte para número para garantir a comparação correta
        const numDoses = Number(doses);

        if (numDoses === 1) {
          // Se for 1, limpa o valor e desabilita os campos
          this.dataProximaVacina.setValue(null);
          this.dataProximaVacina.disable();

          this.intervaloEntreDosesEmDias.setValue(null);
          this.intervaloEntreDosesEmDias.disable();
        } else {
          // Se for qualquer outro valor, habilita os campos novamente
          this.dataProximaVacina.enable();
          this.intervaloEntreDosesEmDias.enable();
        }
      });
  }
  onFormSubmitted() {
    const form = this.vacinacaoForm.getRawValue();
    const payload = {
      felinoId: form.felino.id,
      vacinaId: form.vacina.id,
      lote: form.lote,
      medVet: form.medVet,
      laboratorio: 'teste',
      valorPago: form.valorPago,
      dosesNecessarias: form.dosesNecessarias,
      dataProximaVacina: form.dataProximaVacina,
      intervaloEntreDosesEmDias: form.intervaloEntreDosesEmDias,
      requerReforcoAnual: form.requerReforcoAnual,
    } as VaccinetionCreate;

    console.log('Form Values:', payload);

    this.vacinacaoService.createVaccination(payload).subscribe({
      next: () => {
        this.snackBarService.showSucess('Vacinação realizada com sucesso!');
        this.router.navigate(['home', 'vacinas']);
      },
      error: (error) => {
        console.error(error);
        this.snackBarService.shoError('Erro ao efetuar a vacinação');
      },
    });
  }
  onCancel() {
    this.router.navigate(['home', 'vacinas']);
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
}
