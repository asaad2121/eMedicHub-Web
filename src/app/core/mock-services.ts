import { Signal, signal } from "@angular/core";
import { ApiResponse } from "../shared/DTO/common";
import { Doctor, DoctorsDTO } from "../shared/DTO/doctor";
import { Patient } from "../shared/DTO/patient";
import { UserTypes, UserLoginDTO, User } from "../shared/DTO/user";
import { Observable, of } from "rxjs";
import { Medicine } from "../shared/DTO/medicine";

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

  createPatient = (): Promise<ApiResponse> => {
    return Promise.resolve({} as ApiResponse);
  };
}

export class MockUserStreamService {
  currentUser$: Signal<User> = signal({} as User);

  loginUserAndGetMessage = (
    userType: UserTypes,
    email: string,
    password: string,
    rememberMe: boolean = false,
  ): Promise<UserLoginDTO> => {
    return Promise.resolve({} as UserLoginDTO);
  };

  getCurrentUserFromStorage = (): User => {
    return {} as User;
  };

  getAllDoctors = (): Promise<Doctor[]> => Promise.resolve([] as Doctor[]);

  getAvailableDoctors = (): Promise<DoctorsDTO> => {
    return Promise.resolve({} as DoctorsDTO);
  };

  createNewPatient = (
    patient: Patient,
    isSignUp: boolean = false,
  ): Promise<ApiResponse> => {
    return Promise.resolve({} as ApiResponse);
  };

  clearUserData = (): void => {};

  setCsrfToken = (): Promise<string> => {
    return Promise.resolve("" as string);
  };
}

export class MockMedicineService {
  searchMedicines(query: string): Observable<Medicine[]> {
    const mockData: Medicine[] = [
      { id: "1", name: "Paracetamol", price: 5.25 },
      { id: "2", name: "Ibuprofen", price: 7.5 },
      { id: "3", name: "Amoxicillin", price: 12.0 },
    ];

    const filteredData = mockData.filter((m) =>
      m.name.toLowerCase().includes(query.toLowerCase()),
    );
    return of(filteredData);
  }

  addMedicine = (): Promise<ApiResponse> => {
    return Promise.resolve({} as ApiResponse);
  };
}

export class MockPatientService {
  getDoctorAvailability = (): Promise<ApiResponse> => {
    return Promise.resolve({} as ApiResponse);
  };

  bookAppointment = (): Promise<ApiResponse> => {
    return Promise.resolve({} as ApiResponse);
  };
}

export class MockOrderService {
  getOrders = (): Promise<ApiResponse> => {
    return Promise.resolve({} as ApiResponse);
  };

  updateOrderStatus = (): Promise<ApiResponse> => {
    return Promise.resolve({} as ApiResponse);
  };
}

export class MockSnackbarService {
  openSnackbarWithAction = (message: string): void => {};
}

export class MockRouter {
  navigate = (routes: string[]): void => {};
}
