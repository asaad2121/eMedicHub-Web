import { Component, Input } from "@angular/core";
import { User } from "../../shared/DTO/user";
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { Router } from "@angular/router";

@Component({
  selector: "doctor-dashboard",
  imports: [MatIconModule],
  templateUrl: "./doctor-dashboard.html",
  styleUrl: "./doctor-dashboard.less",
})
export class DoctorDashboard {
  constructor(private router: Router) { }
  @Input()
  user!: User;

  onAddNewPatient() {
    this.router.navigate(["/new-patient-entry"]);
  }

  onViewOrders() {
    this.router.navigate([`/${this.user.type.toLowerCase()}/orders`]);
  }

  viewPatient() {
    this.router.navigate(["/view-patients"]);
  }
  viewAppoinment() {
    this.router.navigate(["/view-appointments"]);
  }
}
