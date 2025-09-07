import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientFilterDialog } from './patient-filter-dialog';

describe('PatientFilterDialog', () => {
  let component: PatientFilterDialog;
  let fixture: ComponentFixture<PatientFilterDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientFilterDialog]
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
