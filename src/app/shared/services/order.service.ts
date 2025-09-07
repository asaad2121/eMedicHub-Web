import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { lastValueFrom } from "rxjs";
import { Order } from "../DTO/orders";
import { UserResponseTypes, UserTypes } from "../DTO/user";

@Injectable({
  providedIn: "root",
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  public async getOrders(userType: string, userId: string): Promise<Order[]> {
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

    return await lastValueFrom(
      this.http.get<Order[]>(`${this.apiUrl}/orders/getOrders`, { params }),
    );
  }
}
