import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { catchError, map, Observable, throwError } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import {
  AppointmentDetails,
  DoctorAppointment,
  PatientAppointment,
} from "../DTO/appointment";
import { UserResponseTypes, UserTypes } from "../DTO/user";
import { Pharma } from "../DTO/pharma";

type Appointment = PatientAppointment | DoctorAppointment;

@Injectable({
  providedIn: "root",
})
export class AppointmentService {
  private apiUrl = `${environment.apiUrl}`;
  constructor(private http: HttpClient) {}

  public getAppointments(
    type: string,
    Id: string,
    page: number,
    limit: number,
  ): Observable<Appointment[]> {
    const userType =
      type == UserResponseTypes.DOCTOR
        ? UserTypes.DOCTOR.toLowerCase()
        : UserTypes.PATIENT.toLowerCase();

    const requestBody: any = {
      type: type,
    };

    if (type === UserResponseTypes.PATIENT) {
      requestBody.patient_id = Id;
    } else if (type === UserResponseTypes.DOCTOR) {
      requestBody.doctor_id = Id;
    }

    if (page > 1) {
      requestBody.limit = limit;
      requestBody.currentPageNo = page;
    }

    const url = `${this.apiUrl}/${userType}/viewAppointments`;
    return this.http.post<Appointment[]>(url, requestBody).pipe(
      map((response: any) => {
        return response?.data ?? [];
      }),
      catchError((error: any) => {
        const mappedError =
          error?.error?.message || "An unexpected error occurred";
        return throwError(() => new Error(mappedError));
      }),
    );
  }

  public getAppointmentDetails(
    type: string,
    appointmentId: string,
  ): Observable<AppointmentDetails> {
    const urlType =
      type === UserResponseTypes.PATIENT
        ? UserTypes.PATIENT.toLowerCase()
        : UserTypes.DOCTOR.toLowerCase();

    const requestBody = {
      type: type,
      appointment_id: appointmentId,
    };

    return this.http
      .post<{
        data: AppointmentDetails;
      }>(`${this.apiUrl}/${urlType}/viewAppointmentData`, requestBody)
      .pipe(
        map((response) => {
          return response?.data ?? {};
        }),
        catchError((error: any) => {
          const mappedError =
            error?.error?.message || "An unexpected error occurred";
          return throwError(() => new Error(mappedError));
        }),
      );
  }

  getPharmaDetails(): Observable<Pharma[]> {
    return this.http.post<any>(`${this.apiUrl}/orders/getPharmacy`, {}).pipe(
      map((response: any) => {
        return response?.data ?? [];
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
}
