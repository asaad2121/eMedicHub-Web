import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "../../shared/DTO/user";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "patient-dashboard",
  imports: [MatIconModule],
  templateUrl: "./patient-dashboard.html",
  styleUrl: "./patient-dashboard.less",
})
export class PatientDashboard {
  constructor(private router: Router) {}
  @Input()
  user!: User;

  onBookAppoinment() {
    this.router.navigate(["/patient-book-appoinment"]);
  }
  viewAppoinment() {
    this.router.navigate(["/view-appointments"]);
  }
  onViewOrders() {
    this.router.navigate([`/${this.user.type.toLowerCase()}/orders`]);
  }
}
