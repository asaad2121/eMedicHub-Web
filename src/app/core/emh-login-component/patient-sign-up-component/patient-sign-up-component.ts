import { Component } from "@angular/core";
import { NewPatientEntryComponent } from "../../../feature/new-patient-entry-component/new-patient-entry-component";

@Component({
  selector: "patient-sign-up-component",
  imports: [NewPatientEntryComponent],
  templateUrl: "./patient-sign-up-component.html",
  styleUrl: "./patient-sign-up-component.less",
})
export class PatientSignUpComponent {}
