import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Doctor, DoctorsDTO } from "../DTO/doctor";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, firstValueFrom, lastValueFrom, map, of } from "rxjs";
import { Patient } from "../DTO/patient";
import { ApiResponse } from "../DTO/common";
import { User, UserResponseTypes, UserTypes } from "../DTO/user";

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

    const requestBody = {
      id: id,
      userType: userType,
    };

    return await lastValueFrom(
      this.http
        .post<{
          data: ApiResponse;
        }>(`${this.apiUrl}/${userTypePath}/getUserProfile`, requestBody)
        .pipe(map((res) => res.data.data as User)),
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

  public async getCsrfToken(): Promise<string> {
    const response = await firstValueFrom(
      this.http.get<{ csrfToken: string }>(`${this.apiUrl}/csrf-token`),
    );
    return response.csrfToken;
  }
}
