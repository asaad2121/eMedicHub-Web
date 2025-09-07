import { Component, Input } from "@angular/core";
import { User } from "../../../shared/DTO/user";

@Component({
  selector: "pharma-view-order",
  imports: [],
  templateUrl: "./pharma-view-order.html",
  styleUrl: "./pharma-view-order.less",
})
export class PharmaViewOrder {
  @Input()
  user!: User;
}
