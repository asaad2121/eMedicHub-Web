import { Injectable, signal, WritableSignal } from "@angular/core";
import { Order, OrderStatus } from "../DTO/orders";
import { OrderService } from "./order.service";

@Injectable({
  providedIn: "root",
})
export class OrderStreamService {
  constructor(private orderService: OrderService) {}

  private ordersForDetails: WritableSignal<Order[]> = signal([]);

  public setOrders(orders: Order[]): void {
    this.ordersForDetails.set(orders);
  }

  public getOrders(): Order[] {
    return this.ordersForDetails();
  }

  public async updateOrderStatus(
    userId: string,
    orderIds: string[],
    status: OrderStatus,
  ): Promise<void> {
    for (const orderId of orderIds) {
      await this.orderService.updateOrderStatus(userId, orderId, status);
    }
  }
}
