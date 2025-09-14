import { UserResponseTypes, UserTypes } from "./DTO/user";

export function mapUserResponseTypeToUserType(
  responseType: UserResponseTypes,
): UserTypes {
  switch (responseType) {
    case UserResponseTypes.DOCTOR:
      return UserTypes.DOCTOR;
    case UserResponseTypes.PHARMACY:
      return UserTypes.PHARMACY;
    case UserResponseTypes.PATIENT:
      return UserTypes.PATIENT;
    default:
      throw new Error(`Unknown user response type: ${responseType}`);
  }
}
