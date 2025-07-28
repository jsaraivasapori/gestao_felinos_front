import { Component, Input, ViewEncapsulation } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

/**
 * Componente de input básico para formulários.
 *
 * Este componente encapsula um campo de entrada com suporte ao Angular Reactive Forms,
 * utilizando Angular Material para estilização. Permite customização de label, placeholder,
 * tipo de input e mensagem de dica.
 *
 * @example
 * <app-basic-input
 *   [control]="formControl"
 *   label="Nome"
 *   placeholder="Digite seu nome"
 *   type="text"
 *   hint="Este campo é obrigatório">
 * </app-basic-input>
 *
 * @property control - FormControl obrigatório do formulário pai.
 * @property label - Texto do rótulo exibido acima do campo.
 * @property placeholder - Texto exibido como placeholder no campo.
 * @property type - Tipo do input (ex: 'text', 'email', 'password').
 * @property hint - Mensagem de dica exibida abaixo do campo.
 */
@Component({
  selector: 'app-basic-input',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './basic-input.component.html',
  styleUrl: './basic-input.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class BasicInputComponent {
  // Recebe o FormControl do formulário pai. É obrigatório.
  @Input({ required: true }) control!: FormControl;

  // Inputs para customização
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() type: string = 'text'; // text, email, password, etc.
  @Input() hint: string = '';
  @Input() disable: boolean = false;
}
