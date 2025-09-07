import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorViewOrder } from './doctor-view-order';

describe('DoctorViewOrder', () => {
  let component: DoctorViewOrder;
  let fixture: ComponentFixture<DoctorViewOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorViewOrder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorViewOrder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
