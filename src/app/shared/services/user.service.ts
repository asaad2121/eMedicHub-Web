import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Doctor, DoctorsDTO } from "../DTO/doctor";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, lastValueFrom, map, of } from "rxjs";
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
  ): Promise<any> {
    const userTypePath =
      userType === UserResponseTypes.DOCTOR
        ? "doctors"
        : userType === UserResponseTypes.PHARMACY
          ? "pharma"
          : "patients";
    return await lastValueFrom(
      this.http
        .get<{
          data: User;
        }>(`${this.apiUrl}/${userTypePath}/getUserProfile/${id}`)
        .pipe(map((res) => res.data)),
    );
  }

  public getAllDoctors(): Promise<Doctor[]> {
    return lastValueFrom(
      this.http
        .get<{ data: Doctor[] }>(`${this.apiUrl}/patients/getDoctors`)
        .pipe(map((items) => items.data)),
    );
  }

  public async getAvailableDoctors(): Promise<DoctorsDTO> {
    return lastValueFrom(
      this.http.get<DoctorsDTO>(`${this.apiUrl}/patients/signup`),
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
}
