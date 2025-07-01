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
import { VacinaService } from '../../../services/vacinaService/vacina.service';
import { SnackBarNotificationService } from '../../../services/snackBarNotification/snack-bar-notification.service';
import { VaccineCreate } from '../../../models/vacinaModel/vacina';

@Component({
  selector: 'app-vacina-dialog',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, DynamicFormComponent],
  templateUrl: './vacina-dialog.component.html',
  styleUrl: './vacina-dialog.component.scss',
})
export class VacinaDialogComponent implements OnInit {
  readonly data = inject(MAT_DIALOG_DATA);
  initialData: any = [];
  isEditMode: boolean = this.data.editMode;
  formConfig: FormField[] = [
    {
      name: 'nome',
      label: 'Vacina',
      type: 'text',
      validators: [Validators.required],
    },
  ];
  constructor(
    readonly dialogRef: MatDialogRef<VacinaDialogComponent>,
    private vacinaService: VacinaService,
    private snackBarService: SnackBarNotificationService
  ) {}

  ngOnInit(): void {
    this.initialData = this.data;
  }

  onFormSubmitted(formValue: VaccineCreate): void {
    if (this.isEditMode) {
      this.vacinaService
        .uppdateVaccine(this.initialData.id, formValue)
        .subscribe({
          complete: () => {
            this.dialogRef.close();
            this.snackBarService.showSucess('Sucesso');
          },
          error: () => {
            this.snackBarService.shoError('Falha na operação');
          },
        });
    } else {
      this.vacinaService.createVaccine(formValue).subscribe({
        complete: () => {
          this.dialogRef.close();
          this.snackBarService.showSucess('Sucesso');
        },
        error: () => {
          this.snackBarService.shoError('Erro');
        },
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
