import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientFilterDialog } from './patient-filter-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('PatientFilterDialog', () => {
  let component: PatientFilterDialog;
  let fixture: ComponentFixture<PatientFilterDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientFilterDialog],
      providers: [
        { provide: MatDialogRef, useValue: {} }, 
        { provide: MAT_DIALOG_DATA, useValue: {} }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientFilterDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
