import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { UserLoginDTO, UserTypes } from "../DTO/user";
import { lastValueFrom } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  public async userLogin(
    userType: UserTypes,
    email: string,
    password: string,
  ): Promise<UserLoginDTO> {
    const loginPayload = { email, password };

    return lastValueFrom(
      this.http.post<UserLoginDTO>(
        `${this.apiUrl}/${userType.toLowerCase()}/login`,
        loginPayload,
      ),
    );
  }
}
