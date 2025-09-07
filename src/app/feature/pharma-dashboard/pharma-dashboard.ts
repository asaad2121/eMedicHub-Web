import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "../../shared/DTO/user";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "pharma-dashboard",
  imports: [MatIconModule],
  templateUrl: "./pharma-dashboard.html",
  styleUrl: "./pharma-dashboard.less",
})
export class PharmaDashboard {
  constructor(private router: Router) {}
  @Input()
  user!: User;

  onViewOrders() {
    this.router.navigate([`/${this.user.type.toLowerCase()}/view-order`]);
  }
}
