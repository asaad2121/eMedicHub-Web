import { Component, Input } from "@angular/core";
import { User } from "../../../shared/DTO/user";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { OrderService } from "../../../shared/services/order.service";
import { Order } from "../../../shared/DTO/orders";

@Component({
  selector: "patient-view-order",
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: "./patient-view-order.html",
  styleUrl: "./patient-view-order.less",
})
export class PatientViewOrder {
  @Input()
  user!: User;

  @Input() orders!: Order[];

  public onViewDetails() {}
}
