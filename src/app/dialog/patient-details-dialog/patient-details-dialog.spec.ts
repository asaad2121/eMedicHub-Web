import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientDetailsDialog } from './patient-details-dialog';

describe('PatientDetailsDialog', () => {
  let component: PatientDetailsDialog;
  let fixture: ComponentFixture<PatientDetailsDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientDetailsDialog]
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
