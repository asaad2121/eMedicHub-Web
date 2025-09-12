import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAppointmentDetails } from './view-appointment-details';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';

describe('ViewAppointmentDetails', () => {
  let component: ViewAppointmentDetails;
  let fixture: ComponentFixture<ViewAppointmentDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAppointmentDetails],
      providers: [provideHttpClient(),
        provideRouter([        
        { path: 'appointment-details/:id', component: ViewAppointmentDetails },        
      ]),
      provideLocationMocks()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAppointmentDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
