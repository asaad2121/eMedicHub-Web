import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UserStreamService } from './user-stream.service';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = `${environment.apiUrl}`;
  private baseUrl = `${this.apiUrl}/doctors/viewPatients`;
 


  constructor(private http: HttpClient) {  
  }

  getPatients(doctorId: string, page: number, limit: number, search?: string): Observable<any> {

    let params = new HttpParams()
      .set('type', 'doctor')
      .set('doctor_id', doctorId)
      .set('limit', limit.toString())
      .set('currentPageNo', page.toString());

    if (search && search.trim().length > 0) {
      params = params.set('searchPatient', search);
    }

    return this.http.get<any>(this.baseUrl, { params });
  }

  searchPatients(doctorId: string, searchPatient: string) {
    const params: any = { doctor_id: doctorId };
    if (searchPatient) {
      params.searchPatient = searchPatient;
    }
    return this.http.get<any>(this.baseUrl, { params });
  }

  searchPatientsWithCurrentPage(doctorId: string, search: string, page: number, limit: number): Observable<any> {
    let params = new HttpParams()
      .set('doctor_id', doctorId)
      .set('searchPatient', search)
      .set('limit', limit.toString())
      .set('currentPageNo', page.toString());
    return this.http.get<any>(this.baseUrl, { params });
  }

  getPatientsByFilter(doctorId: string, result: any, limit: number, page: number, searchPatient: string) {
    console.log('result', result);
    let params = new HttpParams().set('doctor_id', doctorId);
    if (result.blood) {
      params = params.set('bloodGrp', result.blood);    }

    if (result.age) {
      params = params.set('ageRange', result.age);
    }
    if (result.time) {
      params = params.set('lastAppointmentStart', result.time);
    }
    if (searchPatient) {
      params = params.set('searchPatient', searchPatient);
    }
    params = params
      .set('limit', limit.toString())
      .set('currentPageNo', page.toString());
    return this.http.get<any>(this.baseUrl, { params });
  }
}
