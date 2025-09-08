import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientDetailsDialog } from './patient-details-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('PatientDetailsDialog', () => {
  let component: PatientDetailsDialog;
  let fixture: ComponentFixture<PatientDetailsDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientDetailsDialog],
      providers: [{ provide: MatDialogRef, useValue: {} },
      { provide: MAT_DIALOG_DATA, useValue: {} }]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PatientDetailsDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
