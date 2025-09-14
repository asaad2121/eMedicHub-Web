import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { UserStreamService } from "../../shared/services/user-stream.service";
import { Doctor } from "../../shared/DTO/doctor";
import { Patient } from "../../shared/DTO/patient";
import { Router } from "@angular/router";
import { EmhLoadingComponent } from "../../shared/components/emh-loading-component/emh-loading-component";
import { SnackbarService } from "../../shared/services/snackbar.service";

@Component({
  selector: "new-patient-entry-component",
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatIconModule,
    EmhLoadingComponent,
  ],
  templateUrl: "./new-patient-entry-component.html",
  styleUrl: "./new-patient-entry-component.less",
})
export class NewPatientEntryComponent implements OnInit {
  public patientForm!: FormGroup;

  private patient!: Patient;
  private patientId!: string;
  public bloodGroups!: string[];
  public patientIdTypes!: string[]; // Identity, not Id for DB.
  public currentDate!: Date;

  public availableDoctors!: Doctor[];

  public loading = false;

  constructor(
    private userStreamService: UserStreamService,
    private router: Router,
    private snackbar: SnackbarService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.patientForm = new FormGroup({
      // Personal Details
      first_name: new FormControl("", [
        Validators.required,
        Validators.pattern("^[a-zA-Z]*$"),
      ]),
      last_name: new FormControl("", [
        Validators.required,
        Validators.pattern("^[a-zA-Z]*$"),
      ]),
      dob: new FormControl("", Validators.required),
      phone_no: new FormControl("", [
        Validators.required,
        Validators.pattern("^[0-9]{9,}$"),
      ]),
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(8),
      ]),

      // Medical Details
      blood_grp: new FormControl("", Validators.required),
      gp_id: new FormControl("", Validators.required),
      // Address & ID
      address: new FormControl("", Validators.required),
      id_type: new FormControl("", Validators.required),
      id_number: new FormControl("", Validators.required),
    });

    this.currentDate = new Date();
    this.loading = true;
    this.userStreamService.getAvailableDoctors().then((dto) => {
      this.availableDoctors = dto.data.doctors;
      this.bloodGroups = dto.data.bloodGroups;
      this.patientId = dto.data.nextPatientId;
      this.patientIdTypes = dto.data.idTypes;

      this.loading = false;
    });
  }

  public onSubmit(): void {
    this.patient = this.patientForm.value;
    this.patient.id = this.patientId;

    this.loading = true;
    this.userStreamService.createNewPatient(this.patient).then((res) => {
      if (res.success) {
        this.back();
        this.snackbar.openSnackbarWithAction(res.message);
      } else {
        this.snackbar.openSnackbarWithAction(res.message);
      }

      this.loading = false;
    });
  }

  public onCancel() {
    this.back();
  }

  private back() {
    this.router.navigate(["doctors/dashboard"]);
  }
}
