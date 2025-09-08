import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewPatients } from './view-patients';
import { provideHttpClient } from '@angular/common/http';

describe('ViewPatients', () => {
  let component: ViewPatients;
  let fixture: ComponentFixture<ViewPatients>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewPatients],  
      providers: [provideHttpClient(), 
        { provide: MatDialogRef, useValue: {} }, 
        { provide: MAT_DIALOG_DATA, useValue: {} }]
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
