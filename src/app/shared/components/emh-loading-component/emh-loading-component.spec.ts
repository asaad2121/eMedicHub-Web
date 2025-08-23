import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmhLoadingComponent } from './emh-loading-component';

describe('EmhLoadingComponent', () => {
  let component: EmhLoadingComponent;
  let fixture: ComponentFixture<EmhLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmhLoadingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmhLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
