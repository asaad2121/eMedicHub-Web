import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, lastValueFrom, map } from "rxjs";
import { environment } from "../../../environments/environment";
import { Medicine } from "../DTO/medicine";
import { BookingDetails } from "../DTO/patient";
import { ApiResponse } from "../DTO/common";

@Injectable({
  providedIn: "root",
})
export class PatientService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  public getDoctorAvailability(
    doctor_id: string,
    date: string,
  ): Promise<string[]> {
    const requestBody = {
      doctor_id: doctor_id,
      date: date,
    };

    return lastValueFrom(
      this.http
        .post<{
          success: boolean;
          data: string[];
          message: string;
        }>(`${this.apiUrl}/patients/checkDoctorAvailability`, requestBody)
        .pipe(
          map((response) => {
            if (response.success && Array.isArray(response.data)) {
              return response.data;
            } else {
              return [];
            }
          }),
        ),
    );
  }

  public async bookAppointment(
    bookingDetails: BookingDetails,
  ): Promise<ApiResponse> {
    try {
      const response = await lastValueFrom(
        this.http.post<ApiResponse>(
          `${this.apiUrl}/patients/createNewAppointment`,
          bookingDetails,
        ),
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message:
          error.message || "An unexpected error occurred during booking.",
      };
    }
  }
}
