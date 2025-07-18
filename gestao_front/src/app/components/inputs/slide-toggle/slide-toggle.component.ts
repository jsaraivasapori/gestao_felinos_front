import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-slide-toggle',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSlideToggleModule],
  templateUrl: './slide-toggle.component.html',
  styleUrl: './slide-toggle.component.scss',
})
/**
 * A reusable slide toggle component for Angular forms.
 *
 * @remarks
 * This component wraps a Material slide toggle and binds it to a `FormControl`.
 * It allows customization of the label and color.
 *
 * @example
 * ```html
 * <app-slide-toggle
 *   [control]="myFormControl"
 *   label="Enable feature"
 *   color="accent">
 * </app-slide-toggle>
 * ```
 *
 * @property control - The `FormControl` instance to bind the slide toggle to. Required.
 * @property label - The label displayed next to the slide toggle.
 * @property color - The color theme for the slide toggle. Can be `'primary'`, `'accent'`, or `'warn'`. Defaults to `'primary'`.
 */
export class SlideToggleComponent {
  @Input({ required: true }) control!: FormControl;
  @Input() label: string = '';
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
}
