import { Routes } from "@angular/router";
import { EmhLoginComponent } from "./core/emh-login-component/emh-login-component";
import { EmhLandingPage } from "./core/emh-landing-page/emh-landing-page";
import { UserTypes } from "./shared/DTO/user";
export const routes: Routes = [
  {
    path: '', 
    component: EmhLandingPage
  },
  {
    path: ':role/login',
    component: EmhLoginComponent,
  },
];
