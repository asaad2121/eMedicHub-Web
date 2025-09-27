import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAppointmentDetailsDialog } from './view-appointment-details-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('ViewAppointmentDetailsDialog', () => {
  let component: ViewAppointmentDetailsDialog;
  let fixture: ComponentFixture<ViewAppointmentDetailsDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAppointmentDetailsDialog],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(ViewAppointmentDetailsDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
