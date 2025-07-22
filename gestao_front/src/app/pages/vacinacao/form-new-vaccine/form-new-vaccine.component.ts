import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BasicInputComponent } from '../../../components/inputs/basic-input/basic-input.component';
import { ButtonComponent } from '../../../components/button/button.component';
import {
  MatDialogActions,
  MatDialogTitle,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-form-new-vaccine',
  standalone: true,
  imports: [
    BasicInputComponent,
    ButtonComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDialogActions,
    MatDialogTitle,
    MatDialogContent,
  ],
  templateUrl: './form-new-vaccine.component.html',
  styleUrl: './form-new-vaccine.component.scss',
})
export class FormNewVaccineComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<FormNewVaccineComponent>);
  ngOnInit(): void {
    this.vacinaForm = new FormGroup({
      nome: new FormControl('', { validators: [Validators.required] }),
    });
  }

  vacinaForm!: FormGroup;

  //Getter para acessar o controle de nome
  get nome() {
    return this.vacinaForm.get('nome') as FormControl;
  }

  onSubmit() {}
  onCancel() {
    this.dialogRef.close();
  }
}
