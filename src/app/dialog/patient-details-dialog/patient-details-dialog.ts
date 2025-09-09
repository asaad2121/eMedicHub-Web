import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'patient-details-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
  ],
  templateUrl: './patient-details-dialog.html',
  styleUrl: './patient-details-dialog.less'
})
export class PatientDetailsDialog {
  objectKeys = Object.keys;
  constructor(
    public dialogRef: MatDialogRef<PatientDetailsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
}
