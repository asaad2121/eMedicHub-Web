import { Routes } from "@angular/router";
import { EmhLoginComponent } from "./core/emh-login-component/emh-login-component";
import { EmhLandingPage } from "./core/emh-landing-page/emh-landing-page";

export const routes: Routes = [
  {
    path: '', 
    component: EmhLandingPage
  },
  {
    path: "login",
    component: EmhLoginComponent,
  },
];
