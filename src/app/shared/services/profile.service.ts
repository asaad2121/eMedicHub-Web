import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, map } from 'rxjs/operators';
import { ResetPassword, UserProfile } from '../DTO/userprofile';
import { ApiResponse } from '../DTO/common';
@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  getProfile(userType: string, userId: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.apiUrl}/${userType}/getUserProfile/${userId}`, {}
    ).pipe(
      map((response: any) => {
        return response?.data ?? [];
      }),
      catchError((error: any) => {
        const mappedError = error?.error?.message || "An unexpected error occurred";
        return throwError(() => mappedError);
      })
    );
  }

  resetProfile(userType: string, resetPassword: ResetPassword): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/${userType}/resetPassword`, resetPassword).pipe(
      catchError((error: any) => {
        const mappedError = error?.error?.message || "An unexpected error occurred";
        return throwError(() => mappedError);
      }
      ));
  }
}