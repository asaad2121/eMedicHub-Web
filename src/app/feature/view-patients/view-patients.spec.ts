import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPatients } from './view-patients';

describe('ViewPatients', () => {
  let component: ViewPatients;
  let fixture: ComponentFixture<ViewPatients>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewPatients]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPatients);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
