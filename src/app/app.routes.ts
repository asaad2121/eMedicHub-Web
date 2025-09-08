import { Routes } from "@angular/router";
import { EmhLoginComponent } from "./core/emh-login-component/emh-login-component";
import { EmhLandingPage } from "./core/emh-landing-page/emh-landing-page";
import { EmhDashboardComponent } from "./shared/components/emh-dashboard-component/emh-dashboard-component";
import { NewPatientEntryComponent } from "./feature/new-patient-entry-component/new-patient-entry-component";
import { AddNewOrder } from "./feature/add-new-order/add-new-order";
import { PatientBookAppointmentComponent } from "./feature/patient-book-appointment-component/patient-book-appointment-component";

export const routes: Routes = [
  {
    path: "",
    component: EmhLandingPage,
  },
  {
    path: ":role/login",
    component: EmhLoginComponent,
  },
  {
    path: ":role/dashboard",
    component: EmhDashboardComponent,
  },
  {
    path: "new-patient-entry",
    component: NewPatientEntryComponent,
  },
  {
    path: "add-new-order",
    component: AddNewOrder,
  },
  {
    path: "patient-book-appoinment",
    component: PatientBookAppointmentComponent,
  },
];
