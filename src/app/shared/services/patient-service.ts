import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { UserStreamService } from "./user-stream.service";

@Injectable({
  providedIn: "root",
})
export class PatientService {
  private apiUrl = `${environment.apiUrl}`;
  private baseUrl = `${this.apiUrl}/doctors/viewPatients`;

  constructor(private http: HttpClient) {}

  getPatients(
    doctorId: string,
    page: number,
    limit: number,
    search?: string,
  ): Observable<any> {
    const requestBody: any = {
      type: "doctor",
      doctor_id: doctorId,
      limit: limit,
      currentPageNo: page,
    };

    if (search && search.trim().length > 0) {
      requestBody.searchPatient = search;
    }

    return this.http.post<any>(this.baseUrl, requestBody);
  }

  searchPatients(doctorId: string, searchPatient: string) {
    const requestBody: any = { doctor_id: doctorId };
    if (searchPatient) {
      requestBody.searchPatient = searchPatient;
    }

    return this.http.post<any>(this.baseUrl, requestBody);
  }

  searchPatientsWithCurrentPage(
    doctorId: string,
    search: string,
    page: number,
    limit: number,
  ): Observable<any> {
    const requestBody = {
      doctor_id: doctorId,
      searchPatient: search,
      limit: limit,
      currentPageNo: page,
    };

    return this.http.post<any>(this.baseUrl, requestBody);
  }

  getPatientsByFilter(
    doctorId: string,
    result: any,
    limit: number,
    page: number,
    searchPatient: string,
  ) {
    const requestBody: any = {
      doctor_id: doctorId,
      limit: limit,
      currentPageNo: page,
    };

    if (result.blood) {
      requestBody.bloodGrp = result.blood;
    }

    if (result.age) {
      requestBody.ageRange = result.age;
    }

    if (result.time) {
      requestBody.lastAppointmentStart = result.time;
    }

    if (searchPatient) {
      requestBody.searchPatient = searchPatient;
    }

    return this.http.post<any>(this.baseUrl, requestBody);
  }
}
