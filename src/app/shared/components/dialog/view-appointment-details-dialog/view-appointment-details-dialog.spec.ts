import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAppointmentDetailsDialog } from './view-appointment-details-dialog';

describe('ViewAppointmentDetailsDialog', () => {
  let component: ViewAppointmentDetailsDialog;
  let fixture: ComponentFixture<ViewAppointmentDetailsDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAppointmentDetailsDialog]
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
