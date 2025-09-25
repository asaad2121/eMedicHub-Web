import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpClient,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, switchMap, take } from "rxjs/operators";
import { Router } from "@angular/router";
import { SnackbarService } from "./shared/services/snackbar.service";
import { environment } from "../environments/environment";
import { UserStreamService } from "./shared/services/user-stream.service";
import { mapUserResponseTypeToUserType } from "./shared/utils";
import { User, UserResponseTypes, UserTypes } from "./shared/DTO/user";

@Injectable()
export class Http_Interceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private snackbar: SnackbarService,
    private http: HttpClient,
    private userService: UserStreamService,
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const apiUrl = `${environment.apiUrl}`;
    let userType: UserTypes;

    return this.userService.csrfTokenSubject.pipe(
      take(1),
      switchMap((csrfToken) => {
        if (
          !request.url.includes("/login") &&
          !request.url.includes("/logout") &&
          !request.url.includes("/signup") &&
          !request.url.includes("/refresh")
        ) {
          userType = mapUserResponseTypeToUserType(
            this.userService.getCurrentUserFromStorage()
              ?.type as UserResponseTypes,
          );
        }

        const modifiedRequest = request.clone({
          withCredentials: true,
          setHeaders: {
            "X-CSRF-Token": csrfToken || "",
          },
        });

        return next.handle(modifiedRequest).pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 403 && userType) {
              // Attempt to refresh the token using refresh token endpoint.
              return this.http
                .post(
                  `${apiUrl}/${userType}/auth/refresh`,
                  {},
                  { withCredentials: true },
                )
                .pipe(
                  switchMap(() => {
                    // If the refresh token was successfully validated, the new access token
                    // has been set as a cookie by the server.
                    // Retry original failed request.
                    return next.handle(modifiedRequest);
                  }),
                  catchError((refreshError) => {
                    // If the refresh token is also invalid or expired, the refresh call will fail.
                    // In this case, the user's session is over, and they must re-authenticate.
                    console.error("Refresh failed. Redirecting to login.");
                    this.router.navigate(["/"]);
                    return throwError(() => refreshError);
                  }),
                );
            } else if (
              (error.status === 401 || !userType) &&
              !request.url.includes("/signup") &&
              !request.url.includes("/login") &&
              request.url !== "/"
            ) {
              console.error("Unauthorized request. Redirecting to login.");

              this.snackbar.openSnackbarWithAction(
                "Session expired. Please log in again.",
              );

              this.userService.clearUserData();

              this.router.navigate(["/"]);
              return throwError(() => error);
            }

            return throwError(() => error);
          }),
        );
      }),
    );
  }
}
