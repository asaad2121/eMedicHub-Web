import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EmhLoginComponent } from "./emh-login-component";

describe("EmhLoginComponent", () => {
  let component: EmhLoginComponent;
  let fixture: ComponentFixture<EmhLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmhLoginComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmhLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
