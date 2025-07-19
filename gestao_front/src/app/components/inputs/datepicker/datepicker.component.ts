import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

/**
 * Componente de seletor de data (Datepicker) utilizando Angular Material.
 *
 * Permite ao usuário selecionar uma data dentro de um intervalo opcional definido por `minDate` e `maxDate`.
 * O componente é totalmente standalone e pode ser integrado facilmente em formulários reativos.
 *
 * @example
 * ```html
 * <app-datepicker
 *   [control]="formControl"
 *   label="Data de nascimento"
 *   placeholder="Selecione uma data"
 *   [minDate]="minDate"
 *   [maxDate]="maxDate">
 * </app-datepicker>
 * ```
 *
 * @input control - Instância de FormControl associada ao campo de data (obrigatório).
 * @input label - Texto do rótulo exibido acima do campo de data.
 * @input placeholder - Texto exibido como placeholder no campo de data.
 * @input minDate - Data mínima permitida para seleção.
 * @input maxDate - Data máxima permitida para seleção.
 */
@Component({
  selector: 'app-datepicker',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
  ],
  templateUrl: './datepicker.component.html',
  styleUrl: './datepicker.component.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [provideNativeDateAdapter()],
})
export class DatepickerComponent {
  @Input({ required: true }) control!: FormControl;
  @Input() label: string = '';
  @Input() apperence: 'fill' | 'outline' = 'fill';
  @Input() placeholder: string = 'Selecione uma data';
  @Input() minDate: Date | null = null;
  @Input() maxDate: Date | null = null;
}
