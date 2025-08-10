import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmhWelcomeCardComponent } from './emh-welcome-card-component';

describe('EmhWelcomeCardComponent', () => {
  let component: EmhWelcomeCardComponent;
  let fixture: ComponentFixture<EmhWelcomeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmhWelcomeCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmhWelcomeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
