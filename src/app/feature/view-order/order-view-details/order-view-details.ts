import { Component, Input } from "@angular/core";
import { Order } from "../../../shared/DTO/orders";
import { MatCardModule } from "@angular/material/card";
import { MatTableModule } from "@angular/material/table";
import { CommonModule, DecimalPipe } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { Router } from "@angular/router";
import { OrderStreamService } from "../../../shared/services/order-stream.service";

@Component({
  selector: "order-view-details",
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: "./order-view-details.html",
  styleUrl: "./order-view-details.less",
})
export class OrderViewDetailsComponent {
  orders: Order[] = [];

  constructor(
    private router: Router,
    private orderStreamService: OrderStreamService,
  ) {}

  ngOnInit(): void {
    this.orders = this.orderStreamService.getOrders();
  }

  get totalPrice(): number {
    return this.orders.reduce(
      (sum, order) => sum + order.price * order.quantity,
      0,
    );
  }

  onBack(): void {
    this.router.navigate(["/orders"]);
  }
}
