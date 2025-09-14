export enum UserTypes {
  DOCTOR = "Doctors",
  PHARMACY = "Pharma",
  PATIENT = "Patients",
}

export enum UserResponseTypes {
  DOCTOR = "doctor",
  PHARMACY = "pharma",
  PATIENT = "patient",
}

export type UserLoginDTO = {
  message: string;
  data: User;
};

export class User {
  id: string = "";
  firstName: string = "";
  lastname: string = "";
  first_name: string = "";
  last_name: string = "";
  email: string = "";
  type: UserResponseTypes = UserResponseTypes.PATIENT;
}
