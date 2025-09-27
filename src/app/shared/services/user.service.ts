import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Doctor, DoctorDashboardData, DoctorsDTO } from "../DTO/doctor";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, firstValueFrom, lastValueFrom, map, of } from "rxjs";
import { Patient, PatientDashboardData } from "../DTO/patient";
import { ApiResponse } from "../DTO/common";
import { User, UserResponseTypes, UserTypes } from "../DTO/user";
import { PharmaDashboardData } from "../DTO/pharma";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  public async getUserDetails(
    id: string,
    userType: UserResponseTypes,
  ): Promise<User> {
    const userTypePath =
      userType === UserResponseTypes.DOCTOR
        ? "doctors"
        : userType === UserResponseTypes.PHARMACY
          ? "pharma"
          : "patients";

    const url = `${this.apiUrl}/${userTypePath}/getUserProfile/${id}`;

    return await lastValueFrom(
      this.http.post<ApiResponse>(url, {}).pipe(
        map((res) => {
          const user = res.data as User;

          if (!user?.type) {
            user.type = UserResponseTypes.PHARMACY;
          }
          if (!user.first_name?.length) {
            user.first_name = user.name as string;
          }

          return user;
        }),
      ),
    );
  }

  public getAllDoctors(): Promise<Doctor[]> {
    return lastValueFrom(
      this.http
        .post<{ data: Doctor[] }>(`${this.apiUrl}/patients/getDoctors`, {})
        .pipe(map((items) => items.data)),
    );
  }

  public async getAvailableDoctors(): Promise<DoctorsDTO> {
    return lastValueFrom(
      this.http.post<DoctorsDTO>(`${this.apiUrl}/patients/signupInfo`, {}),
    );
  }

  public async createPatient(patient: Patient): Promise<ApiResponse> {
    return await lastValueFrom(
      this.http
        .post<ApiResponse>(`${this.apiUrl}/doctors/addNewPatient`, patient)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            return of({
              success: false,
              message:
                error.error?.error[0].msg ||
                `An error occurred: ${error.statusText}`,
              statusCode: error.status,
              error: error.error || { message: error.message },
            } as ApiResponse);
          }),
        ),
    );
  }

  public async patientSignup(patient: Patient): Promise<ApiResponse> {
    return await lastValueFrom(
      this.http
        .post<ApiResponse>(`${this.apiUrl}/patients/signup`, patient)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            return of({
              success: false,
              message:
                error.error?.error[0].msg ||
                `An error occurred: ${error.statusText}`,
              statusCode: error.status,
              error: error.error || { message: error.message },
            } as ApiResponse);
          }),
        ),
    );
  }

  public async getUserData(
    userId: string,
    userType: UserTypes | UserResponseTypes,
  ): Promise<DoctorDashboardData | PatientDashboardData | PharmaDashboardData> {
    let url: string;
    let body: {};

    if (
      userType === UserTypes.DOCTOR ||
      userType === UserResponseTypes.DOCTOR
    ) {
      url = `${this.apiUrl}/doctors/getDoctorAppointmentsDashboard`;
      body = { doctor_id: userId };
    } else if (
      userType === UserTypes.PATIENT ||
      userType === UserResponseTypes.PATIENT
    ) {
      url = `${this.apiUrl}/patients/getPatientDashboard`;
      body = { patient_id: userId };
    } else {
      url = `${this.apiUrl}/pharma/getPharmacyDashboard`;
      body = { pharma_id: userId };
    }

    return await lastValueFrom(
      this.http
        .post<ApiResponse>(url, body)
        .pipe(map((response) => response.data)),
    );
  }

  public async getCsrfToken(): Promise<string> {
    const response = await firstValueFrom(
      this.http.get<{ csrfToken: string }>(`${this.apiUrl}/csrf-token`),
    );
    return response.csrfToken;
  }
}
