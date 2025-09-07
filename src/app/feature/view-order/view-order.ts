import { Component, OnInit } from "@angular/core";
import { UserStreamService } from "../../shared/services/user-stream.service";
import { User, UserResponseTypes } from "../../shared/DTO/user";
import { PatientViewOrder } from "./patient-view-order/patient-view-order";
import { PharmaDashboard } from "../pharma-dashboard/pharma-dashboard";
import { PharmaViewOrder } from "./pharma-view-order/pharma-view-order";
import { DoctorViewOrder } from "./doctor-view-order/doctor-view-order";
import { OrderService } from "../../shared/services/order.service";
import { Order } from "../../shared/DTO/orders";
import { EmhLoadingComponent } from "../../shared/components/emh-loading-component/emh-loading-component";

@Component({
  selector: "view-order",
  imports: [
    PatientViewOrder,
    PharmaViewOrder,
    DoctorViewOrder,
    EmhLoadingComponent,
  ],
  templateUrl: "./view-order.html",
  styleUrl: "./view-order.less",
})
export class ViewOrder implements OnInit {
  public user!: User;
  public orders!: Order[];

  public loading = true;

  UserResponseTypes = UserResponseTypes;

  constructor(
    private userStreamService: UserStreamService,
    private orderService: OrderService,
  ) {}

  async ngOnInit() {
    this.user = this.userStreamService.currentUser$();

    if (!Object.keys(this.user).length) {
      this.user = this.userStreamService.getCurrentUserFromStorage();
    }

    this.orders = await this.orderService.getOrders(
      this.user.type,
      this.user.id,
    );

    this.loading = false;
  }
}
