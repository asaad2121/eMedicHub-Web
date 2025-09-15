import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PatientSignUpComponent } from "./patient-sign-up-component";
import { UserStreamService } from "../../../shared/services/user-stream.service";
import { MockUserStreamService } from "../../mock-services";

describe("PatientSignUpComponent", () => {
  let component: PatientSignUpComponent;
  let fixture: ComponentFixture<PatientSignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientSignUpComponent],
      providers: [
        { provide: UserStreamService, useClass: MockUserStreamService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PatientSignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should render the NewPatientEntryComponent child component", () => {
    const childComponent = fixture.nativeElement.querySelector(
      "new-patient-entry-component",
    );
    expect(childComponent).toBeTruthy();
  });
});
