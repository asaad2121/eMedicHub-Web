import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
@Component({
  selector: 'patient-filter-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
  ],
  templateUrl: './patient-filter-dialog.html',
  styleUrl: './patient-filter-dialog.less'
})
export class PatientFilterDialog {
  ageRanges = ['0-9', '10-17', '18-30', '31-50', '51+'];
  bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  timeRanges = ['Last week', 'Last month', 'Last 3 months', 'Older than 3 months'];

  selectedAge = '';
  selectedBlood = '';
  selectedTime = '';

  constructor(
    public dialogRef: MatDialogRef<PatientFilterDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.selectedAge = data?.selectedAge || '';
    this.selectedBlood = data?.selectedBlood || '';
    this.selectedTime = data?.selectedTime || '';
  }

  applyFilters() {
    this.dialogRef.close({
      age: this.selectedAge,
      blood: this.selectedBlood,
      time: this.selectedTime
    });
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
