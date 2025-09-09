import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { lastValueFrom } from "rxjs";

import { UserResponseTypes } from "../DTO/user";
import { OrderResponse, Order, OrderStatus } from "../DTO/orders";

@Injectable({
  providedIn: "root",
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  public async getOrders(
    userType: string,
    userId: string,
    patientSearch: string = "",
  ): Promise<Order[]> {
    let params = new HttpParams();
    let idParam = "";

    switch (userType) {
      case UserResponseTypes.PATIENT:
        idParam = "patient_id";
        params = params.set("type", UserResponseTypes.PATIENT);
        break;
      case UserResponseTypes.DOCTOR:
        idParam = "doctor_id";
        params = params.set("type", UserResponseTypes.DOCTOR);
        break;
      case UserResponseTypes.PHARMACY:
        idParam = "pharma_id";
        params = params.set("type", UserResponseTypes.PHARMACY);
        break;
    }

    params = params.set(idParam, userId);
    params = params.set("patientSearch", patientSearch);

    return await lastValueFrom(
      this.http.get<OrderResponse>(`${this.apiUrl}/orders/getOrders`, {
        params,
      }),
    ).then((res) => res.data);
  }

  public async updateOrderStatus(
    pharmaId: string,
    orderId: string,
    status: OrderStatus,
  ): Promise<any> {
    const body = {
      pharma_id: pharmaId,
      status,
      order_id: orderId,
    };

    return lastValueFrom(
      this.http.post(`${this.apiUrl}/pharma/updateOrderStatus`, body),
    );
  }
}
