import { Routes } from "@angular/router";
import { EmhLoginComponent } from "./core/emh-login-component/emh-login-component";
import { EmhLandingPage } from "./core/emh-landing-page/emh-landing-page";
import { EmhDashboardComponent } from "./shared/components/emh-dashboard-component/emh-dashboard-component";
import { NewPatientEntryComponent } from "./feature/new-patient-entry-component/new-patient-entry-component";
import { AddNewOrder } from "./feature/add-new-order/add-new-order";
import { PatientBookAppointmentComponent } from "./feature/patient-book-appointment-component/patient-book-appointment-component";
import { ViewOrder } from "./feature/view-order/view-order";

import { ViewPatients } from "./feature/view-patients/view-patients";
import { ViewAppointments } from "./feature/view-appointments/view-appointments";
import { ViewAppointmentDetails } from "./feature/view-appointment-details/view-appointment-details";

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
    path: "add-new-order/:id",
    component: AddNewOrder
  },
  {
    path: "view-patients",
    component: ViewPatients,
  },
  {
    path: "patient-book-appoinment",
    component: PatientBookAppointmentComponent,
  },
  {
    path: "view-appointments",
    component: ViewAppointments
  },
  { path: 'appointment-details/:id', 
    component: ViewAppointmentDetails },
  {
    path: ":role/orders",
    component: ViewOrder,
  },
];
