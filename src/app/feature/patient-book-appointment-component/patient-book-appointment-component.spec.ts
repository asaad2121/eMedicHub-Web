import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { PatientBookAppointmentComponent } from "./patient-book-appointment-component";
import {
  MockPatientService,
  MockUserStreamService,
} from "../../core/mock-services";
import { UserStreamService } from "../../shared/services/user-stream.service";
import { PatientService } from "../../shared/services/patient.service";
import { SnackbarService } from "../../shared/services/snackbar.service";
import { Router } from "@angular/router";
import { Doctor, VisitingHours } from "../../shared/DTO/doctor";
import { BookingDetails } from "../../shared/DTO/patient";
import { User, UserTypes } from "../../shared/DTO/user";

// Mock data to be used in tests
const mockDoctors: Doctor[] = [
  {
    id: "1",
    first_name: "Sarah",
    last_name: "Smith",
    name: "Dr. Sarah Smith",
    dob: "01/01/1980",
    email: "sarah.smith@example.com",
    visiting_hours: {
      monday: { M: { start: { S: "9:00 AM" }, end: { S: "5:00 PM" } } },
      tuesday: { M: { start: { S: "9:00 AM" }, end: { S: "5:00 PM" } } },
      wednesday: { M: { start: { S: "9:00 AM" }, end: { S: "5:00 PM" } } },
      thursday: { M: { start: { S: "9:00 AM" }, end: { S: "5:00 PM" } } },
      friday: { M: { start: { S: "9:00 AM" }, end: { S: "5:00 PM" } } },
    },
  },
];

const mockPatient: User = {
  id: "patient-123",
  firstName: "Jane",
  lastname: "Doe",
  email: "jane.doe@example.com",
  type: UserTypes.PATIENT,
};

const mockAvailableSlots = ["9:00 AM", "9:30 AM", "10:00 AM"];

describe("PatientBookAppointmentComponent", () => {
  let component: PatientBookAppointmentComponent;
  let fixture: ComponentFixture<PatientBookAppointmentComponent>;
  let userStreamService: UserStreamService;
  let patientService: PatientService;
  let snackbarService: SnackbarService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientBookAppointmentComponent],
      providers: [
        { provide: UserStreamService, useClass: MockUserStreamService },
        { provide: PatientService, useClass: MockPatientService },
        {
          provide: SnackbarService,
          useValue: jasmine.createSpyObj("SnackbarService", [
            "openSnackbarWithAction",
          ]),
        },
        {
          provide: Router,
          useValue: jasmine.createSpyObj("Router", ["navigate"]),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PatientBookAppointmentComponent);
    component = fixture.componentInstance;

    // Get instances of the services
    userStreamService = TestBed.inject(UserStreamService);
    patientService = TestBed.inject(PatientService);
    snackbarService = TestBed.inject(SnackbarService);
    router = TestBed.inject(Router);

    // Initial change detection to trigger ngOnInit
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should fetch doctors on ngOnInit and set loading state", fakeAsync(() => {
    const getAllDoctorsSpy = spyOn(
      userStreamService,
      "getAllDoctors",
    ).and.returnValue(Promise.resolve(mockDoctors));
    component.ngOnInit();
    expect(component.loading).toBe(true);
    tick(); // Resolve the promise
    expect(getAllDoctorsSpy).toHaveBeenCalled();
    expect(component.availableDoctors).toEqual(mockDoctors);
    expect(component.loading).toBe(false);
  }));

  it("should update the selected doctor signal", () => {
    const mockDoctor = mockDoctors[0];
    component.selectDoctor(mockDoctor);
    expect(component.selectedDoctor()).toEqual(mockDoctor);
  });

  it("should update date and reset time slots on onDateChange", () => {
    const mockDate = "2024-05-20";
    const event = { target: { value: mockDate } } as unknown as Event;

    // Set some initial state to be reset
    component.selectedTimeSlot.set("9:00 AM");
    component.showTimeSlots.set(true);

    component.onDateChange(event);
    expect(component.selectedDate()).toBe(mockDate);
    expect(component.selectedTimeSlot()).toBe(null);
    expect(component.showTimeSlots()).toBe(false);
  });

  it("should fetch available slots and set state correctly on checkAvailability", fakeAsync(() => {
    const getAvailabilitySpy = spyOn(
      patientService,
      "getDoctorAvailability",
    ).and.returnValue(Promise.resolve(mockAvailableSlots));
    const mockDoctor = mockDoctors[0];
    const mockDate = "2024-05-20";

    component.selectedDoctor.set(mockDoctor);
    component.selectedDate.set(mockDate);

    component.checkAvailability();
    expect(component.loading).toBe(true);
    expect(getAvailabilitySpy).toHaveBeenCalledWith(mockDoctor.id, mockDate);

    tick(); // Resolve the promise
    expect(component.availableSlots()).toEqual(mockAvailableSlots);
    expect(component.showTimeSlots()).toBe(true);
    expect(component.loading).toBe(false);
  }));

  it("should update selected time slot", () => {
    const mockSlot = "10:00 AM";
    component.selectTimeSlot(mockSlot);
    expect(component.selectedTimeSlot()).toBe(mockSlot);
  });

  it("should book an appointment, show snackbar, reset form, and navigate back", fakeAsync(() => {
    // Arrange
    const bookAppointmentSpy = spyOn(
      patientService,
      "bookAppointment",
    ).and.returnValue(
      Promise.resolve({ success: true, message: "Booking successful" }),
    );
    spyOn(userStreamService, "getCurrentUserFromStorage").and.returnValue(
      mockPatient,
    );

    // Set up component state
    const mockDoctor = mockDoctors[0];
    const mockDate = "2024-05-20";
    const mockSlot = "10:00 AM";
    const mockNotes = "Test notes";

    component.selectedDoctor.set(mockDoctor);
    component.selectedDate.set(mockDate);
    component.selectedTimeSlot.set(mockSlot);
    component.additionalNotes = mockNotes;

    // Act
    component.bookAppointment();
    tick(); // Resolve the promise

    // Assert
    const expectedBookingDetails: BookingDetails = {
      patient_id: mockPatient.id,
      doctor_id: mockDoctor.id,
      date: mockDate,
      start_time: mockSlot,
      note: mockNotes,
    };
    expect(bookAppointmentSpy).toHaveBeenCalledWith(expectedBookingDetails);
    expect(snackbarService.openSnackbarWithAction).toHaveBeenCalledWith(
      "Booking successful",
    );
    expect(router.navigate).toHaveBeenCalledWith(["patients/dashboard"]);

    // Verify form reset

    expect(component.selectedDate()).not.toBe(mockDate);
    expect(component.selectedTimeSlot()).toBe(null);
    expect(component.additionalNotes).toBe("");
  }));

  it("should format visiting hours correctly", () => {
    const mockVisitingHours: VisitingHours = {
      monday: { M: { start: { S: "9:00 AM" }, end: { S: "5:00 PM" } } },
      wednesday: { M: { start: { S: "9:00 AM" }, end: { S: "5:00 PM" } } },
      friday: { M: { start: { S: "9:00 AM" }, end: { S: "5:00 PM" } } },
    };
    // Test the helper function directly
    const result = component.getAvailabilityString(mockVisitingHours);
    expect(result).toBe("Mon, Wed, Fri, 9:00 AM - 5:00 PM");
  });
});
