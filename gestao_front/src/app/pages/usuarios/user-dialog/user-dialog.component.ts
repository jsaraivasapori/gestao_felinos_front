import { Component, inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { DynamicFormComponent } from '../../../components/dynamic-from/dynamic-form.component';
import { FormField } from '../../../models/form-field';
import { Validators } from '@angular/forms';
import {
  Usuario,
  UsuarioCreate,
} from '../../../models/usuarioModel/usuarios-model';
import { UsuarioService } from '../../../services/usuarioService/usuario-service';
import { SnackBarNotificationService } from '../../../services/snackBarNotification/snack-bar-notification.service';

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, DynamicFormComponent],
  templateUrl: './user-dialog.component.html',
  styleUrl: './user-dialog.component.scss',
})
export class UserDialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<UserDialogComponent>);
  readonly data = inject(MAT_DIALOG_DATA);
  public isEditMode: boolean = this.data.editMode;

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
        { value: 'Administrador', label: 'Administrador' },
        { value: 'Gerencial', label: 'Gerencial' },
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
  ];

  constructor(
    private usuarioService: UsuarioService,
    private snackBarService: SnackBarNotificationService
  ) {}

  ngOnInit(): void {
    this.initialData = this.data;
    console.log('NgOnInit do Modal :', this.initialData);
  }
  onFormSubmitted(formValue: UsuarioCreate): void {
    if (this.isEditMode) {
      this.usuarioService.update(this.initialData.id, formValue).subscribe({
        complete: () => {
          this.dialogRef.close();
          this.snackBarService.showSucess('Sucesso');
        },

        error: () => this.snackBarService.shoError('Erro'),
      });
    } else {
      console.log(this.data);
      this.usuarioService.create(formValue).subscribe({
        next: () => {
          this.dialogRef.close();

          this.snackBarService.showSucess('Usuário Cadastrado');
        },
        error: (erro) => {
          console.error(erro);
          this.snackBarService.shoError('Algo deu errado');
        },
      });
    }

    //aqui e para submeter o form
  }

  onCancel() {
    console.log('Form Cancelado');
    this.dialogRef.close();

    //aqui é para cancelar o form
  }
}
