import { Component, Input, OnInit } from "@angular/core";
import { User } from "../../shared/DTO/user";
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { Router } from "@angular/router";
import { CommonModule, NgClass } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { ViewPatients } from "../view-patients/view-patients";
import { EmhLoadingComponent } from "../../shared/components/emh-loading-component/emh-loading-component";
import { UserStreamService } from "../../shared/services/user-stream.service";
import { DoctorDashboardData } from "../../shared/DTO/doctor";

@Component({
  selector: "doctor-dashboard",
  imports: [
    CommonModule,
    MatSidenavModule,
    MatButtonModule,
    MatListModule,
    MatToolbarModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatDividerModule,
    MatMenuModule,
    ViewPatients,
    EmhLoadingComponent,
  ],
  templateUrl: "./doctor-dashboard.html",
  styleUrl: "./doctor-dashboard.less",
})
export class DoctorDashboard {
  @Input()
  user!: User;

  @Input()
  loading = true;

  @Input()
  isMobile = false;

  @Input()
  dashboardData!: DoctorDashboardData;

  public viewTodayCards = false;

  constructor(private router: Router) {}

  public onAddNewPatient() {
    this.router.navigate(["/new-patient-entry"]);
  }

  public onViewOrders() {
    this.router.navigate([`/${this.user.type.toLowerCase()}/orders`]);
  }

  public onViewPatient() {
    this.router.navigate([`/${this.user.type.toLowerCase()}/view-patients`]);
  }

  public onViewAppointments() {
    this.router.navigate([`/${this.user.type.toLowerCase()}/view-appointments`]);
  }
}
