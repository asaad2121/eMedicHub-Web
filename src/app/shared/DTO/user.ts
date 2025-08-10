export enum UserTypes {
  DOCTOR = "Doctors",
  PHARMACY = "Pharma",
  PATIENT = "Patients",
}

export type UserLoginDTO = {
  message: string;
  data: User;
};

export class User {
  id: string = "";
  firstName: string = "";
  lastname: string = "";
  email: string = "";
  type: UserTypes = UserTypes.PATIENT;
}
