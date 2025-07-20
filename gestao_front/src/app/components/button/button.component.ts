import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Definindo os tipos de estilo de botão para melhor type safety
type ButtonStyle =
  | 'raised'
  | 'stroked'
  | 'flat'
  | 'icon'
  | 'fab'
  | 'mini-fab'
  | 'basic';
type ButtonColor = 'primary' | 'accent' | 'warn' | undefined;

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
/**
 * Componente de botão reutilizável para a interface do usuário.
 *
 * Permite configuração de aparência (texto, ícone, estilo, cor) e comportamento (tipo, desabilitado, carregando).
 * Emite um evento `clicked` quando o botão é pressionado, desde que não esteja desabilitado ou em estado de carregamento.
 *
 * @example
 * <app-button
 *   [text]="'Salvar'"
 *   [icon]="'save'"
 *   [buttonStyle]="'raised'"
 *   [color]="'accent'"
 *   [type]="'submit'"
 *   [disabled]="false"
 *   [loading]="false"
 *   (clicked)="onSalvar()"
 * ></app-button>
 *
 * @input text Texto exibido no botão.
 * @input icon Ícone opcional exibido ao lado do texto.
 * @input buttonStyle Estilo visual do botão ('raised', etc).
 * @input color Cor do botão ('primary', 'accent', etc).
 * @input type Tipo do botão ('button', 'submit', 'reset').
 * @input disabled Indica se o botão está desabilitado.
 * @input loading Indica se o botão está em estado de carregamento.
 * @output clicked Evento emitido ao clicar no botão, se não estiver desabilitado ou carregando.
 */
export class ButtonComponent {
  // --- CONFIGURAÇÃO DE APARÊNCIA ---
  @Input() text: string = '';
  @Input() icon: string | null = null;
  @Input() buttonStyle: ButtonStyle = 'raised';
  @Input() color: ButtonColor = 'primary';

  // --- CONFIGURAÇÃO DE COMPORTAMENTO ---
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;

  // --- EVENTO DE SAÍDA ---
  @Output() clicked = new EventEmitter<void>();

  onClick(): void {
    // Só emite o evento se não estiver desabilitado ou carregando
    if (!this.disabled && !this.loading) {
      this.clicked.emit();
    }
  }
}
