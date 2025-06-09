import { Component } from '@angular/core';
import { CardComponent } from '../../../components/card/card.component';
import { DynamicFormComponent } from '../../../components/dynamic-from/dynamic-form.component';
import { SharedService } from '../../../services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Voluntario } from '../../../models/voluntarioModel/voluntario-model';
import { FormField } from '../../../models/form-field';
import { Validators } from '@angular/forms';
import { VoluntarioService } from '../../../services/voluntarioService/voluntario.service';

@Component({
  selector: 'app-voluntarios-form',
  standalone: true,
  imports: [CardComponent, DynamicFormComponent],
  templateUrl: './voluntarios-form.component.html',
  styleUrl: './voluntarios-form.component.scss',
})
export class VoluntariosFormComponent {
  isEditMode: boolean = false;
  initialData!: any;
  formConfig: FormField[] = [
    {
      name: 'nome',
      label: 'Voluntario',
      type: 'text',
      validators: [Validators.required],
      errorMessages: { required: 'Campo obrigatório' },
    },
    {
      name: 'telefone',
      label: 'Telefone',
      type: 'text',
      validators: [Validators.required, Validators.maxLength(11)],
      errorMessages: { required: 'Campo obrigatório' },
    },
    {
      name: 'turno',
      label: 'Turno',
      type: 'select',
      validators: [Validators.required],
      errorMessages: { required: 'Campo obrigatório' },
      options: [
        { value: 'matutino', label: 'Matutino' },
        { value: 'vespertino', label: 'Vespertino' },
        { value: 'noturno', label: 'Noturno' },
      ],
    },
    {
      name: 'largadouro',
      label: 'Largadouro',
      type: 'text',
      validators: [Validators.required],
      errorMessages: { required: 'Campo obrigatório' },
    },
    {
      name: 'bairro',
      label: 'Bairro',
      type: 'text',
      validators: [Validators.required],
      errorMessages: { required: 'Campo obrigatório' },
    },
    {
      name: 'cidade',
      label: 'Cidade',
      type: 'select',
      validators: [Validators.required],
      errorMessages: { required: 'Campo obrigatório' },
      options: [{ value: 'montesClaros', label: 'Montes Claros' }],
    },
    {
      name: 'cep',
      label: 'CEP',
      type: 'text',
    },
  ];
  constructor(
    private sharedService: SharedService,
    private router: Router,
    private route: ActivatedRoute,
    private voluntarioService: VoluntarioService
  ) {}

  ngOnInit(): void {
    this.initialData = this.sharedService.getData('currentVolunteer');
    // Se estiver no modo de edição, preenche os dados iniciais
    if (this.initialData && this.initialData.id) {
      this.isEditMode = true;
    } else {
      this.isEditMode = false;
      this.initialData = {};
    }
  }
  ngOnDestroy(): void {
    this.sharedService.clearData('currentVolunteer');
  }
  onFormSubmitted(formValue: Voluntario): void {
    if (this.isEditMode) {
      this.voluntarioService
        .updateVoluntario(this.initialData.id, formValue)
        .subscribe({
          complete: () => {
            this.sharedService.clearData('currentVolunteer');
            this.router.navigate(['../'], { relativeTo: this.route });
          },
          error: (error) => {
            console.error(error);
          },
        });
    } else {
      this.voluntarioService.createVoluntaraio(formValue).subscribe({
        complete: () =>
          this.router.navigate(['../'], { relativeTo: this.route }),
        error: (error) => {
          console.error(error);
        },
      });
    }
  }
  onCancel(): void {
    this.sharedService.clearData('currentVolunteer');
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
