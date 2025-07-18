import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

/**
 * Componente de seleção reutilizável baseado em Angular Material.
 *
 * Permite criar um campo de seleção (dropdown) altamente configurável,
 * recebendo um array de opções e os nomes das propriedades que representam
 * o valor e o texto de cada opção.
 *
 * @example
 * <app-select
 *   [control]="formControl"
 *   label="Selecione uma opção"
 *   placeholder="Escolha..."
 *   [options]="listaDeOpcoes"
 *   optionValue="id"
 *   optionText="nome"
 * ></app-select>
 *
 * @input control - Instância do FormControl para controle do valor do select.
 * @input label - Texto do label exibido acima do campo.
 * @input placeholder - Texto exibido como placeholder dentro do campo.
 * @input options - Array de objetos que representam as opções do select.
 * @input optionValue - Nome da propriedade do objeto de opção que será usado como valor.
 * @input optionText - Nome da propriedade do objeto de opção que será exibido como texto.
 */
@Component({
  selector: 'app-select',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
})
export class SelectComponent {
  // Inputs padrão
  @Input({ required: true }) control!: FormControl;
  @Input() label: string = '';
  @Input() placeholder: string = '';

  // Inputs específicos para o select
  @Input() options: any[] = []; // O array de opções

  // Nomes das propriedades a serem usadas para o valor e texto da opção.
  // Isso torna o componente extremamente reutilizável.
  @Input({ required: true }) optionValue!: string;
  @Input({ required: true }) optionText!: string;
}
