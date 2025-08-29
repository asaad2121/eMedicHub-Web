import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewOrder } from './add-new-order';

describe('AddNewOrder', () => {
  let component: AddNewOrder;
  let fixture: ComponentFixture<AddNewOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewOrder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewOrder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
