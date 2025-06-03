import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormField } from '../../models/form-field';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgxMaskDirective } from 'ngx-mask';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    NgxMaskDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss',
})
export class DynamicFormComponent implements OnInit {
  @Input() formConfig: FormField[] = []; // Configuração dos campos
  @Input() initialData: any = []; // Dados iniciais para o formulário
  @Input() submitLabel: string = 'Enviar'; // Texto do botão de envio
  @Output() formSubmitted = new EventEmitter<any>(); // Emite os dados do formulário para ser tratado no componente pai
  @Output() cancel = new EventEmitter<void>(); // emite evento de cancelamento para ser tratado no componente pai

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    const controlsConfig: { [key: string]: any } = {};
    // Configura os controles dinamicamente com base nos campos recebidos de formConfig
    this.formConfig.forEach((field) => {
      //tratameto para dataPicker
      if (field.type === 'datePicker') {
        let value = null;

        //verificar se há dados inicais

        if (this.initialData[field.name]) {
          //converte de string para Date se necessário

          //no objeto do initalData usa o nome do field (loop forEach) como chave.
          //ao usuar this.initialData[field.name] retorna o valor associado a essa chave que e a data em questao.
          value =
            typeof this.initialData[field.name] === 'string'
              ? new Date(this.initialData[field.name])
              : this.initialData[field.name];
        } else if (field.value) {
          value = new Date(field.value);
        }
        controlsConfig[field.name] = [value, field.validators || []]; // ← Isso que cria o campo!
      } else {
        controlsConfig[field.name] = [
          this.initialData[field.name] ?? field.value ?? '',
          field.validators || [],
        ];
      }
    });
    this.form = this.fb.group(controlsConfig);
  }

  onSubmit(): void {
    // Emite os dados do formulário quando ele é submetido e está válido
    if (this.form.valid) {
      this.formSubmitted.emit(this.form.value);
    }
  }
  onCancel(): void {
    this.cancel.emit(); //emite o evento de cancelamento ao clicar no botao de cancelar
  }

  getErrorKeys(field: FormField): string[] {
    // Retorna as chaves dos erros definidos na configuração de mensagens de erro
    return field.errorMessages ? Object.keys(field.errorMessages) : [];
  }

  // Retorna os campos que não são slide-toggle nem textarea
  getNonToggleAndNonTextareaFields(): FormField[] {
    return this.formConfig.filter(
      (field) => field.type !== 'slide-toggle' && field.type !== 'textarea'
    );
  }

  // Filtra apenas os campos do tipo textarea
  getTextAreaFields(): FormField[] {
    return this.formConfig.filter((field) => field.type === 'textarea');
  }

  // Filtra somente os campos do tipo slide-toggle
  getToggles(): FormField[] {
    return this.formConfig.filter((field) => field.type === 'slide-toggle');
  }
}
