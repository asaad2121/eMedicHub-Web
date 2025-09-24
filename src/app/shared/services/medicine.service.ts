import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { Medicine, PatientMedicines } from "../DTO/medicine";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { catchError, map } from "rxjs/operators";
import { ApiResponse } from "../DTO/common";
@Injectable({
  providedIn: "root",
})
export class MedicineService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  searchMedicines(query: string): Observable<Medicine[]> {
    return this.http
      .post<{
        success: boolean;
        data: any[];
        message: string;
      }>(`${this.apiUrl}/orders/searchMedicines`, { name: query })
      .pipe(
        map((response) => {
          if (response.success && Array.isArray(response.data)) {
            return response.data;
          } else {
            return [];
          }
        }),
        catchError((error: any) => {
          const mappedError =
            error?.error?.message ||
            error.message ||
            "An unexpected error occurred during search";
          return throwError(() => new Error(mappedError));
        }),
      );
  }

  addMedicine(prescription: PatientMedicines): Observable<ApiResponse> {
    return this.http
      .post<ApiResponse>(`${this.apiUrl}/orders/createNewOrder`, prescription)
      .pipe(
        catchError((error: any) => {
          const mappedError =
            error?.error?.message || "An unexpected error occurred";
          return throwError(() => new Error(mappedError));
        }),
      );
  }
}
