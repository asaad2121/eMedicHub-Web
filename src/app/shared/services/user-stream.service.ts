import { Injectable, signal, WritableSignal } from "@angular/core";
import { User, UserLoginDTO, UserTypes } from "../DTO/user";
import { AuthenticationService } from "./authentication.service";

@Injectable({
  providedIn: "root",
})
export class UserStreamService {
  private readonly currentUserSignal: WritableSignal<User> = signal({} as User);

  public readonly currentUser$ = this.currentUserSignal.asReadonly();

  constructor(private authentication: AuthenticationService) {}

  public async loginUserAndGetMesage(
    userType: UserTypes,
    email: string,
    password: string
  ): Promise<UserLoginDTO> {
    const user = await this.authentication.userLogin(userType, email, password);

    this.currentUserSignal.set(user.data);

    return user;
  }
}
