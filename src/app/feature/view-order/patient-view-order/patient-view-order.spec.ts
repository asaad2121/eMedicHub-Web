import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientViewOrder } from './patient-view-order';

describe('PatientViewOrder', () => {
  let component: PatientViewOrder;
  let fixture: ComponentFixture<PatientViewOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientViewOrder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientViewOrder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
