import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { NewPatientEntryComponent } from "./new-patient-entry-component";
import { ReactiveFormsModule, FormsModule, FormGroup } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";
import { Router } from "@angular/router";

import { DoctorsDTO } from "../../shared/DTO/doctor";

import {
  MockUserStreamService,
  MockRouter,
  MockSnackbarService,
  MockAuthenticationService,
} from "../../core/mock-services";
import { AuthenticationService } from "../../shared/services/authentication.service";
import { SnackbarService } from "../../shared/services/snackbar.service";
import { UserStreamService } from "../../shared/services/user-stream.service";

describe("NewPatientEntryComponent", () => {
  let component: NewPatientEntryComponent;
  let fixture: ComponentFixture<NewPatientEntryComponent>;
  let userStreamService: UserStreamService;
  let router: MockRouter;
  let snackbarService: MockSnackbarService;

  beforeEach(fakeAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NewPatientEntryComponent,
        ReactiveFormsModule,
        CommonModule,
        FormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSelectModule,
        MatIconModule,
      ],
      providers: [
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        { provide: UserStreamService, useClass: MockUserStreamService },
        { provide: Router, useClass: MockRouter },
        { provide: SnackbarService, useClass: MockSnackbarService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NewPatientEntryComponent);
    component = fixture.componentInstance;

    userStreamService = TestBed.inject(UserStreamService);
    router = TestBed.inject(Router) as any;
    snackbarService = TestBed.inject(SnackbarService) as any;

    spyOn(userStreamService, "getAvailableDoctors").and.returnValue(
      Promise.resolve({
        data: {
          doctors: [{ id: "1", name: "Dr. Smith" }],
          bloodGroups: ["A+", "B-"],
          nextPatientId: "P123",
          idTypes: ["Passport", "National ID"],
        },
      } as DoctorsDTO),
    );

    fixture.detectChanges();
    tick();
  }));

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  describe("ngOnInit", () => {
    it("should initialize the form with empty values", () => {
      expect(component.patientForm).toBeInstanceOf(FormGroup);
      expect(component.patientForm.value.first_name).toBe("");
    });

    it("should set loading to true, call getAvailableDoctors, and set loading to false", () => {
      expect(component.loading).toBeFalse();
      expect(userStreamService.getAvailableDoctors).toHaveBeenCalled();
      expect(component.availableDoctors.length).toBe(1);
      expect(component.bloodGroups.length).toBe(2);
    });
  });

  describe("Form Validation", () => {
    it("should have an invalid form initially", () => {
      expect(component.patientForm.valid).toBeFalse();
    });

    it("should have a valid form when all fields are filled correctly", () => {
      const patientData = {
        first_name: "John",
        last_name: "Doe",
        dob: "1990-01-01",
        phone_no: "1234567890",
        email: "john.doe@example.com",
        password: "password123",
        blood_grp: "A+",
        gp_id: "1",
        address: "123 Main St",
        id_type: "Passport",
        id_number: "A1234567",
      };
      component.patientForm.setValue(patientData);
      expect(component.patientForm.valid).toBeTrue();
    });
  });

  describe("onSubmit", () => {
    let createPatientSpy: jasmine.Spy;
    let routerSpy: jasmine.Spy;
    let snackbarSpy: jasmine.Spy;

    beforeEach(() => {
      createPatientSpy = spyOn(
        userStreamService,
        "createNewPatient",
      ).and.returnValue(
        Promise.resolve({
          success: true,
          message: "Patient created successfully.",
        }),
      );
      routerSpy = spyOn(router, "navigate");
      snackbarSpy = spyOn(snackbarService, "openSnackbarWithAction");
    });

    it("should call createNewPatient with correct data when form is valid", () => {
      const patientData = {
        first_name: "John",
        last_name: "Doe",
        dob: "1990-01-01",
        phone_no: "1234567890",
        email: "john.doe@example.com",
        password: "password123",
        blood_grp: "A+",
        gp_id: "1",
        address: "123 Main St",
        id_type: "Passport",
        id_number: "A1234567",
      };
      component.patientForm.setValue(patientData);
      component.onSubmit();
      const expectedPatient = {
        ...component.patientForm.value,
        id: "P123",
      };
      expect(createPatientSpy).toHaveBeenCalledWith(
        expectedPatient,
        component.isSignUp,
      );
    });

    it("should handle successful sign-up navigation", fakeAsync(() => {
      const patientData = {
        first_name: "John",
        last_name: "Doe",
        dob: "1990-01-01",
        phone_no: "1234567890",
        email: "john.doe@example.com",
        password: "password123",
        blood_grp: "A+",
        gp_id: "1",
        address: "123 Main St",
        id_type: "Passport",
        id_number: "A1234567",
      };
      component.patientForm.setValue(patientData);
      component.isSignUp = true;
      component.onSubmit();
      tick();
      expect(component.loading).toBeFalse();
      expect(routerSpy).toHaveBeenCalledWith(["patients/login"]);
      expect(snackbarSpy).toHaveBeenCalledWith(
        "Sign in successful. Please log in with your credentials.",
      );
    }));
  });

  describe("back and onCancel", () => {
    beforeEach(() => {
      spyOn(router, "navigate");
    });

    it("should navigate to the doctors dashboard when onCancel is called", () => {
      component.onCancel();
      expect(router.navigate).toHaveBeenCalledWith(["doctors/dashboard"]);
    });

    it("should navigate to the doctors dashboard when the private back method is called", () => {
      (component as any).back();
      expect(router.navigate).toHaveBeenCalledWith(["doctors/dashboard"]);
    });
  });
});
