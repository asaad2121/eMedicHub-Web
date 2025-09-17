import { Routes } from "@angular/router";
import { EmhLoginComponent } from "./core/emh-login-component/emh-login-component";
import { EmhLandingPage } from "./core/emh-landing-page/emh-landing-page";
import { EmhDashboardComponent } from "./shared/components/emh-dashboard-component/emh-dashboard-component";
import { NewPatientEntryComponent } from "./feature/new-patient-entry-component/new-patient-entry-component";
import { AddNewOrder } from "./feature/add-new-order/add-new-order";
import { PatientBookAppointmentComponent } from "./feature/patient-book-appointment-component/patient-book-appointment-component";
import { ViewOrder } from "./feature/view-order/view-order";

import { ViewPatients } from "./feature/view-patients/view-patients";
import { EmhErrorPageComponent } from "./core/emh-error-page-component/emh-error-page-component";
import { loggedInUserGuard } from "./core/route-guards/LoggedInUserGuard";
import { userRoleGuard } from "./core/route-guards/UserRoleGuard";
import { ViewAppointments } from "./feature/view-appointments/view-appointments";
import { ViewAppointmentDetails } from "./feature/view-appointment-details/view-appointment-details";
import { PatientSignUpComponent } from "./core/emh-login-component/patient-sign-up-component/patient-sign-up-component";

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
    path: "patients/sign-up",
    component: PatientSignUpComponent,
  },
  {
    path: ":role/dashboard",
    component: EmhDashboardComponent,
    canActivate: [loggedInUserGuard, userRoleGuard],
  },
  {
    path: "new-patient-entry",
    component: NewPatientEntryComponent,
    canActivate: [loggedInUserGuard],
  },
  {
    path: "add-new-order/:id",
    component: AddNewOrder,
    canActivate: [loggedInUserGuard],
  },
  {
    path: "view-patients",
    component: ViewPatients,
    canActivate: [loggedInUserGuard],
  },
  {
    path: "patient-book-appoinment",
    component: PatientBookAppointmentComponent,
    canActivate: [loggedInUserGuard],
  },
  {
    path: ":role/orders",
    component: ViewOrder,
    canActivate: [loggedInUserGuard],
  },
  {
    path: "view-appointments",
    component: ViewAppointments,
	canActivate: [loggedInUserGuard],
  },
  { path: 'appointment-details/:id', 
    component: ViewAppointmentDetails,
	canActivate: [loggedInUserGuard],
  },
  { path: "error", component: EmhErrorPageComponent },
  { path: "**", redirectTo: "/error" },
];