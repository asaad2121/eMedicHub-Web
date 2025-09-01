import { Signal, signal } from "@angular/core";
import { ApiResponse } from "../shared/DTO/common";
import { Doctor, DoctorsDTO } from "../shared/DTO/doctor";
import { Patient } from "../shared/DTO/patient";
import { UserTypes, UserLoginDTO, User } from "../shared/DTO/user";

export class MockAuthenticationService {
  userLogin = (
    userType: UserTypes,
    email: string,
    password: string,
  ): Promise<UserLoginDTO> => {
    return Promise.resolve({
      data: {} as User,
      message: "Mock login failed or user not found",
      success: false,
      statusCode: 401,
    });
  };
}

export class MockUserService {
  getAllDoctors = (): Promise<Doctor[]> => {
    return Promise.resolve([] as Doctor[]);
  };

  getAvailableDoctors = (): Promise<DoctorsDTO> => {
    return Promise.resolve({} as DoctorsDTO);
  };

  createPatient = (patient: Patient): Promise<ApiResponse> => {
    return Promise.resolve({} as ApiResponse);
  };
}

export class MockUserStreamService {
  currentUser$: Signal<User> = signal({} as User);

  loginUserAndGetMesage = (): Promise<UserLoginDTO> => {
    return Promise.resolve({} as UserLoginDTO);
  };

  getCurrentUserFromStorage = (): User => {
    return {} as User;
  };

  getAllDoctors = (): Promise<Doctor[]> => Promise.resolve([] as Doctor[]);

  getAvailableDoctors = (): Promise<DoctorsDTO> => {
    return Promise.resolve({} as DoctorsDTO);
  };

  createNewPatient = (): Promise<ApiResponse> => {
    return Promise.resolve({} as ApiResponse);
  };
}
