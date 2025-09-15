import { UserResponseTypes, UserTypes } from "./DTO/user";

export function mapUserResponseTypeToUserType(
  userType: UserResponseTypes,
): UserTypes {
  switch (userType) {
    // If the input is one of the response types, perform the mapping.
    case UserResponseTypes.DOCTOR:
      return UserTypes.DOCTOR;
    case UserResponseTypes.PHARMACY:
      return UserTypes.PHARMACY;
    case UserResponseTypes.PATIENT:
      return UserTypes.PATIENT;

    // If the input doesn't match a UserResponseTypes value,
    // it's already a UserTypes value, so we return it as is.
    default:
      return userType;
  }
}
