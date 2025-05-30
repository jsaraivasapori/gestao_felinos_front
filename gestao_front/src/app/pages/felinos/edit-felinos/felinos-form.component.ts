import { Component, Input } from '@angular/core';
import { DynamicFormComponent } from '../../../components/dynamic-from/dynamic-form.component';
import { Validators } from '@angular/forms';
import { FormField } from '../../../models/form-field';
import { SharedService } from '../../../services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FelinoService } from '../../../services/felinoService/felino.service';
import { Felino } from '../../../models/felinoModel/felino-model';

@Component({
  selector: 'app-felinos-form',
  standalone: true,
  imports: [DynamicFormComponent],
  templateUrl: './felinos-form.component.html',
  styleUrl: './felinos-form.component.scss',
})
export class FelinosFormComponent {
  @Input() data: any;

  // Configuração dos campos do formulário
  formConfig: FormField[] = [
    {
      name: 'nome',
      label: 'Felino ',
      type: 'text',
      validators: [Validators.required],
      errorMessages: { required: 'Este campo é obrigatório.' },
    },
    {
      name: 'idade',
      label: 'Idade em anos',
      type: 'number',
      validators: [Validators.required],
      errorMessages: {
        required: 'Idade é obigatória',
      },
    },
    {
      name: 'raca',
      label: 'Raça',
      type: 'select',
      validators: [Validators.required],
      errorMessages: { required: 'Selecione uma categoria.' },
      options: [
        { value: 'sem_raca', label: 'Sem Raça' },
        { value: 'siames', label: 'Siamês' },
        { value: 'persa', label: 'Persa' },
      ],
    },

    {
      name: 'observacao',
      label: 'Observação',
      type: 'textarea', // define como textarea
      validators: [Validators.required],
      errorMessages: { required: 'O campo Observação é obrigatório.' },
    },
    // Os campos do tipo slide-toggle ficarão agrupados no DynamicForm
    {
      name: 'isolado',
      label: 'isolado',
      type: 'slide-toggle',
      value: false,
    },
    {
      name: 'fiv',
      label: 'FIV',
      type: 'slide-toggle',
      value: false,
    },
    {
      name: 'felv',
      label: 'FELV',
      type: 'slide-toggle',
      value: false,
    },
    {
      name: 'pif',
      label: 'PIF',
      type: 'slide-toggle',
      value: false,
    },
  ];
  isEditMode: boolean = false;

  initialData: any;
  constructor(
    private sharedService: SharedService,
    private router: Router,
    private route: ActivatedRoute,
    private felinoService: FelinoService
  ) {}

  ngOnInit(): void {
    this.initialData = this.sharedService.getData('currentFeline');
    // Se estiver no modo de edição, preenche os dados iniciais

    if (this.initialData && this.initialData.id) {
      this.isEditMode = true;
    } else {
      this.isEditMode = false;
      this.initialData = {};
    }
  }

  ngOnDestroy(): void {
    this.sharedService.clearData('currentFeline');
  }
  /**
   * Método chamado quando o formulário for submetido.
   * Recebe os dados do formulário do output formSubmitted do dynamic-form e realiza a ação necessária
   * (por exemplo, uma chamada HTTP para atualizar ou criar um registro).
   *
   * @param formValue - Os dados enviados pelo formulário dynamic-form.
   */
  onFormSubmitted(formValue: Felino): void {
    if (this.isEditMode) {
      console.log(this.initialData.id);

      this.felinoService
        .updateFelino(this.initialData.id, formValue)
        .subscribe({
          complete: () => {
            this.sharedService.clearData('currentFeline');
            this.router.navigate(['../'], { relativeTo: this.route });
          },
          error: (error) => {
            console.error(error);
          },
        });
    } else {
      this.felinoService.createFelino(formValue).subscribe({
        complete: () => {
          this.router.navigate(['../'], { relativeTo: this.route });
        },
        error: (error) => {
          console.error(error);
        },
      });
    }
  }

  onCancel(): void {
    this.sharedService.clearData('currentFeline');
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
