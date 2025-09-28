import { Component, computed, OnInit, signal } from "@angular/core";
import { Doctor, VisitingHours } from "../../shared/DTO/doctor";
import { UserStreamService } from "../../shared/services/user-stream.service";
import { EmhLoadingComponent } from "../../shared/components/emh-loading-component/emh-loading-component";
import { NgClass } from "@angular/common";
import { PatientService } from "../../shared/services/patient.service";
import { BookingDetails } from "../../shared/DTO/patient";
import { SnackbarService } from "../../shared/services/snackbar.service";
import { FormsModule, NgModel } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: "patient-book-appointment-component",
  imports: [EmhLoadingComponent, NgClass, FormsModule],
  templateUrl: "./patient-book-appointment-component.html",
  styleUrl: "./patient-book-appointment-component.less",
})
export class PatientBookAppointmentComponent implements OnInit {
  public availableDoctors!: Doctor[];

  public additionalNotes: string = "";

  public loading = false;

  // Signals for state management
  selectedDoctor = signal<Doctor>({} as Doctor);
  selectedDate = signal(this.getFormattedDate(new Date()));
  selectedTimeSlot = signal<string | null>(null);
  showTimeSlots = signal(false);
  availableSlots = signal<string[]>([]);

  today = signal(this.getFormattedDate(new Date()));
  maxDate = signal(this.getFormattedDate(this.getMaxDate()));

  constructor(
    private userStreamService: UserStreamService,
    private patientService: PatientService,
    private snackbar: SnackbarService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.userStreamService.getAllDoctors().then((docs) => {
      this.availableDoctors = docs;

      this.loading = false;
    });
  }

  // Event handlers
  public selectDoctor(doctor: Doctor) {
    this.selectedDoctor.set(doctor);
  }

  public onDateChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.selectedDate.set(inputElement.value);
    this.showTimeSlots.set(false); // Hide time slots on date change
    this.selectedTimeSlot.set(null); // Clear selected time slot
  }

  public async checkAvailability() {
    this.loading = true;

    let availableSlots: string[] = [];

    try {
      availableSlots = await this.patientService.getDoctorAvailability(
        this.selectedDoctor().id,
        this.selectedDate(),
      );
      this.availableSlots.set(availableSlots);
      this.showTimeSlots.set(true);
    } catch (error) {
      this.availableSlots.set([]);
      this.snackbar.openSnackbarWithAction(
        "Doctor not available on selected date.",
      );
    }

    this.availableSlots.set(availableSlots);

    this.showTimeSlots.set(true);

    this.loading = false;
  }

  public selectTimeSlot(slot: string) {
    this.selectedTimeSlot.set(slot);
  }

  public async bookAppointment() {
    this.loading = true;

    const bookingDetails = {
      patient_id: this.userStreamService.getCurrentUserFromStorage().id,
      doctor_id: this.selectedDoctor().id,
      date: this.selectedDate(),
      start_time: this.selectedTimeSlot(),
      note: this.additionalNotes,
    } as BookingDetails;

    await this.patientService.bookAppointment(bookingDetails).then((res) => {
      this.snackbar.openSnackbarWithAction(res.message);
      this.resetForm();

      this.back();
    });
  }

  // Helper function to reset form state
  private resetForm() {
    this.selectedDoctor.set({} as Doctor);
    this.selectedDate.set(this.getFormattedDate(new Date()));
    this.selectedTimeSlot.set(null);
    this.additionalNotes = "";
    this.showTimeSlots.set(false);
    this.availableSlots.set([]);
  }

  // Helper function to get date in 'YYYY-MM-DD' format
  private getFormattedDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  private getMaxDate(): Date {
    const date = new Date();
    date.setMonth(date.getMonth() + 6);
    return date;
  }

  public getAvailabilityString(visitingHours: VisitingHours): string {
    const days: string[] = [];
    let hours = "";

    const dayMap: { [key: string]: string } = {
      monday: "Mon",
      tuesday: "Tue",
      wednesday: "Wed",
      thursday: "Thu",
      friday: "Fri",
      saturday: "Sat",
      sunday: "Sun",
    };

    for (const [day, schedule] of Object.entries(visitingHours)) {
      if (schedule) {
        days.push(dayMap[day]);
        if (!hours) {
          hours = `${schedule.M.start.S} - ${schedule.M.end.S}`;
        }
      }
    }

    if (days.length === 0) {
      return "Not Available";
    }

    return `${days.join(", ")}, ${hours}`;
  }

  public back() {
    this.loading = false;
    this.router.navigate(["patients/dashboard"]);
  }
}
