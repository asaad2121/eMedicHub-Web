import { Injectable, signal, WritableSignal } from "@angular/core";
import { User, UserLoginDTO, UserTypes } from "../DTO/user";
import { AuthenticationService } from "./authentication.service";
import { UserService } from "./user.service";
import { Doctor, DoctorsDTO } from "../DTO/doctor";
import { Patient } from "../DTO/patient";
import { ApiResponse } from "../DTO/common";

@Injectable({
  providedIn: "root",
})
export class UserStreamService {
  private readonly currentUserSignal: WritableSignal<User> = signal({} as User);

  public readonly currentUser$ = this.currentUserSignal.asReadonly();

  constructor(
    private authentication: AuthenticationService,
    private userService: UserService,
  ) {}

  public async loginUserAndGetMesage(
    userType: UserTypes,
    email: string,
    password: string,
  ): Promise<UserLoginDTO> {
    const user = await this.authentication.userLogin(userType, email, password);

    this.currentUserSignal.set(user.data);

    localStorage.setItem("currentUser", JSON.stringify(user.data));

    return user;
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

  public async createNewPatient(patient: Patient): Promise<ApiResponse> {
    return await this.userService.createPatient(patient);
  }
}
