import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmaViewOrder } from './pharma-view-order';

describe('PharmaViewOrder', () => {
  let component: PharmaViewOrder;
  let fixture: ComponentFixture<PharmaViewOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmaViewOrder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PharmaViewOrder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
