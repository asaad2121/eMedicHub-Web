import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DoctorAppointment, PatientAppointment } from '../DTO/appointment';
import { UserResponseTypes } from '../DTO/user';
type Appointment = PatientAppointment | DoctorAppointment;
@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = `${environment.apiUrl}`;  
  constructor(private http: HttpClient) {
  }
  
  getAppointments(type: string, Id: string, page: number, limit: number): Observable<any> {
    let params = new HttpParams().set('type', type);

    if (type === UserResponseTypes.PATIENT) {
      params = params.set('patient_id', Id);
    } else if (type === UserResponseTypes.DOCTOR) {
      params = params.set('doctor_id', Id);
    }

    if (page > 1) {
      params = params
        .set('limit', limit.toString())
        .set('currentPageNo', page.toString());
    }

    const url = `${this.apiUrl}/patients/viewAppointments`;
    return this.http.get<any>(url, { params });
  }

  getAppointmentDetails(type: string, appointmentId: string): Observable<{ appointment: any }> {
    const urlType = (type === UserResponseTypes.PATIENT) ? 'patients' : 'doctors';
    const params = new HttpParams()
      .set('type', type)
      .set('appointment_id', appointmentId);

    return this.http.get<{ appointment: any }>(`${this.apiUrl}/${urlType}/viewAppointmentData`, { params });
  }
}
