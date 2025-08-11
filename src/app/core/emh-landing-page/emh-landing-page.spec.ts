import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmhLandingPage } from './emh-landing-page';

describe('EmhLandingPage', () => {
  let component: EmhLandingPage;
  let fixture: ComponentFixture<EmhLandingPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmhLandingPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmhLandingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
