import { Routes } from "@angular/router";
import { EmhLoginComponent } from "./core/emh-login-component/emh-login-component";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
  },
  {
    path: "login",
    component: EmhLoginComponent,
  },
];
