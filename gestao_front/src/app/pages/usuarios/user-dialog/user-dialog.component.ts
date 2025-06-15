import { Component, inject, model } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { DynamicFormComponent } from '../../../components/dynamic-from/dynamic-form.component';
import { FormField } from '../../../models/form-field';
import { Validators } from '@angular/forms';
import { UsuarioCreate } from '../../../models/usuarioModel/usuarios-model';
import { SharedService } from '../../../services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, DynamicFormComponent],
  templateUrl: './user-dialog.component.html',
  styleUrl: './user-dialog.component.scss',
})
export class UserDialogComponent {
  readonly dialogRef = inject(MatDialogRef<UserDialogComponent>);
  readonly data = inject(MAT_DIALOG_DATA);
  public isEditMode: boolean = false;

  public initialData: any = [];
  public formConfig: FormField[] = [
    {
      name: 'nome',
      label: 'Usuário ',
      type: 'text',
      validators: [Validators.required],
      errorMessages: { required: 'Este campo é obrigatório.' },
    },
    {
      name: 'perfil',
      label: 'Perfil',
      type: 'select',
      validators: [Validators.required],
      errorMessages: { required: 'Selecione uma categoria.' },
      options: [
        { value: 'administrador', label: 'Administrador' },
        { value: 'gerencial', label: 'Gerencial' },
      ],
    },
    {
      name: 'login',
      label: 'Login ',
      type: 'text',
      validators: [Validators.required],
      errorMessages: { required: 'Este campo é obrigatório.' },
    },
    {
      name: 'senha',
      label: 'Senha ',
      type: 'text',
      validators: [Validators.required],
      errorMessages: { required: 'Este campo é obrigatório.' },
    },
    {
      name: 'dataCriacao',
      label: 'Criado em:',
      type: 'datePicker',
    },
    {
      name: 'dataatualziacao',
      label: 'Atualizado em :',
      type: 'datePicker',
    },
  ];

  constructor(
    private sharedService: SharedService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  onFormSubmitted(formValue: UsuarioCreate) {
    console.log('Dados submetidos', formValue);
    this.dialogRef.close();

    //aqui e para submeter o form
  }

  onCancel() {
    console.log('Form Cancelado');
    this.dialogRef.close();

    //aqui é para cancelar o form
  }
}
