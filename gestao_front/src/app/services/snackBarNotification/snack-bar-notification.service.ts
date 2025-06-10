import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackBarNotificationService {
  constructor(private snackBar: MatSnackBar) {}

  showSucess(message: string) {
    this.snackBar.open(message, ' X ', {
      data: message,
      panelClass: ['success-snackbar'],
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'end',
    });
  }

  shoError(message: string) {
    this.snackBar.open(message, 'X', {
      data: message,
      panelClass: ['error-snackbar'],
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'end',
    });
  }
}
