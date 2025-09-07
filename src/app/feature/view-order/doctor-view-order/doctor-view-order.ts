import { Component, Input } from "@angular/core";
import { User } from "../../../shared/DTO/user";

@Component({
  selector: "doctor-view-order",
  imports: [],
  templateUrl: "./doctor-view-order.html",
  styleUrl: "./doctor-view-order.less",
})
export class DoctorViewOrder {
  @Input()
  user!: User;
}
