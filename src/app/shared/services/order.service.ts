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
    limit: number,
    currentPageNo: number,
  ): Promise<OrderResponse> {
    const requestBody: any = {};

    switch (userType) {
      case UserResponseTypes.PATIENT:
        requestBody.patient_id = userId;
        requestBody.type = UserResponseTypes.PATIENT;
        break;
      case UserResponseTypes.DOCTOR:
        requestBody.doctor_id = userId;
        requestBody.type = UserResponseTypes.DOCTOR;
        break;
      case UserResponseTypes.PHARMACY:
        requestBody.pharma_id = userId;
        requestBody.type = UserResponseTypes.PHARMACY;
        break;
    }

    requestBody.patientSearch = patientSearch;
    requestBody.limit = limit;
    requestBody.currentPageNo = currentPageNo;

    return await lastValueFrom(
      this.http.post<OrderResponse>(
        `${this.apiUrl}/orders/getOrders`,
        requestBody,
      ),
    );
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
