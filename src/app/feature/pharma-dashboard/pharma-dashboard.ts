import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "../../shared/DTO/user";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { EmhLoadingComponent } from "../../shared/components/emh-loading-component/emh-loading-component";
import { PharmaDashboardData } from "../../shared/DTO/pharma";
import { OrderStatus } from "../../shared/DTO/orders";

@Component({
  selector: "pharma-dashboard",
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
  templateUrl: "./pharma-dashboard.html",
  styleUrl: "./pharma-dashboard.less",
})
export class PharmaDashboard {
  constructor(private router: Router) {}

  @Input()
  user!: User;

  @Input()
  loading = false;

  @Input()
  isMobile = false;

  @Input()
  dashboardData!: PharmaDashboardData;

  // Expose enum to template
  OrderStatus = OrderStatus;

  public onViewOrders() {
    this.router.navigate([`/${this.user.type.toLowerCase()}/orders`]);
  }
}
