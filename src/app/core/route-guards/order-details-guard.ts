import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router,
  UrlTree,
} from "@angular/router";
import { UserStreamService } from "../../shared/services/user-stream.service";
import { OrderStreamService } from "../../shared/services/order-stream.service";

@Injectable({ providedIn: "root" })
export class OrderDetailsGuard implements CanActivate {
  constructor(
    private userStreamService: UserStreamService,
    private orderStreamService: OrderStreamService,
    private router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const user = this.userStreamService.getCurrentUserFromStorage();

    if (!user) {
      return this.router.parseUrl("/login");
    }

    // Prevent route if no order is selected
    if (!this.orderStreamService.getOrders()) {
      return this.router.parseUrl(`/${user.type}/orders`);
    }

    return true;
  }
}
