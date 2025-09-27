import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "../../shared/DTO/user";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from "@angular/common";
import { MatListModule } from "@angular/material/list";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { EmhLoadingComponent } from "../../shared/components/emh-loading-component/emh-loading-component";
import { PatientDashboardData } from "../../shared/DTO/patient";

@Component({
  selector: "patient-dashboard",
  imports: [
    MatIconModule,
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
    EmhLoadingComponent,
  ],
  templateUrl: "./patient-dashboard.html",
  styleUrl: "./patient-dashboard.less",
})
export class PatientDashboard {
  @Input()
  user!: User;

  @Input()
  loading = false;

  @Input()
  isMobile = false;

  @Input()
  dashboardData!: PatientDashboardData;

  constructor(private router: Router) {}

  public onBookAppoinment() {
    this.router.navigate(["/patient-book-appoinment"]);
  }

  public onViewAppoinments() {
    this.router.navigate([`/${this.user.type.toLowerCase()}/view-appointments`]);
  }

  public onViewOrders() {
    this.router.navigate([`/${this.user.type.toLowerCase()}/orders`]);
  }
}
