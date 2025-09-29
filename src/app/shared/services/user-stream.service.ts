import { Injectable, signal, WritableSignal } from "@angular/core";
import { User, UserLoginDTO, UserTypes } from "../DTO/user";
import { AuthenticationService } from "./authentication.service";
import { UserService } from "./user.service";
import { Doctor, DoctorDashboardData, DoctorsDTO } from "../DTO/doctor";
import { Patient, PatientDashboardData } from "../DTO/patient";
import { ApiResponse } from "../DTO/common";
import { BehaviorSubject, catchError, map, Observable, of } from "rxjs";
import { PharmaDashboardData } from "../DTO/pharma";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class UserStreamService {
  private readonly currentUserSignal: WritableSignal<User> = signal({} as User);

  public readonly currentUser$ = this.currentUserSignal.asReadonly();

  private userDashboardData$ = new BehaviorSubject<
    DoctorDashboardData | PatientDashboardData | PharmaDashboardData | null
  >(null);

  private cachedCsrfToken: string | null = null;

  constructor(
    private authentication: AuthenticationService,
    private userService: UserService,
    private http: HttpClient,
  ) {}

  public async loginUserAndGetMessage(
    userType: UserTypes,
    email: string,
    password: string,
    rememberMe: boolean = false,
  ): Promise<UserLoginDTO> {
    const user = await this.authentication.userLogin(
      userType,
      email,
      password,
      rememberMe,
    );

    this.setCurrentUser(user.data);

    localStorage.setItem("currentUser", JSON.stringify(user.data));

    return user;
  }

  public setCurrentUser(user: User) {
    this.currentUserSignal.set(user);
  }

  public getCurrentUserFromStorage(): User {
    const user = localStorage.getItem("currentUser");

    return JSON.parse(user as string);
  }

  public async getAllDoctors(): Promise<Doctor[]> {
    return await this.userService.getAllDoctors();
  }

  public async getAvailableDoctors(): Promise<DoctorsDTO> {
    // To add new patient
    return await this.userService.getAvailableDoctors();
  }

  public async createNewPatient(
    patient: Patient,
    isSignUp: boolean = false,
  ): Promise<ApiResponse> {
    return isSignUp
      ? await this.userService.patientSignup(patient)
      : await this.userService.createPatient(patient);
  }

  public async getCurrentUserDetails(user: User): Promise<User> {
    const userInStorage = this.getCurrentUserFromStorage();
    const userData = user?.id ? user : userInStorage;

    userData.type = userData.type || userInStorage.type;

    if (
      userData.type &&
      (userData.first_name?.length || userData.name?.length)
    ) {
      this.setCurrentUser(userData);
      return Promise.resolve(userData);
    }

    try {
      this.userService
        .getUserDetails(userData.id, userData.type)
        .then((userRes) => {
          userRes.type = user?.type || userRes.type;
          this.setCurrentUser(userRes);
          return userRes;
        });
    } finally {
      return userData;
    }
  }

  public clearUserData() {
    this.currentUserSignal.set({} as User);
    this.userDashboardData$.next(null);
    localStorage.removeItem("currentUser");
  }

  public async getUserDashboardData(
    user: User,
  ): Promise<DoctorDashboardData | PatientDashboardData | PharmaDashboardData> {
    const dashboardData = await this.userService.getUserData(
      user.id,
      user.type,
    );

    this.userDashboardData$.next(dashboardData);

    return dashboardData;
  }

  public fetchCsrfToken(forceRefresh = false): Observable<string> {
    if (this.cachedCsrfToken && !forceRefresh) {
      return of(this.cachedCsrfToken);
    }

    return this.http
      .get<{ csrfToken: string }>(`${environment.apiUrl}/csrf-token`, {
        withCredentials: true, // include session cookie
      })
      .pipe(
        map((res) => {
          this.cachedCsrfToken = res.csrfToken;
          return res.csrfToken;
        }),
        catchError((err) => {
          console.warn("Failed to fetch CSRF token", err);
          return of(""); // fallback empty token
        }),
      );
  }

  public clearCsrfToken() {
    this.cachedCsrfToken = null;
  }
}
