import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAppointments } from './view-appointments';
import { provideHttpClient } from '@angular/common/http';

describe('ViewAppointments', () => {
  let component: ViewAppointments;
  let fixture: ComponentFixture<ViewAppointments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAppointments],
      providers: [provideHttpClient()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAppointments);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
