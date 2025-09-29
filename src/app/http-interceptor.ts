import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpClient,
} from "@angular/common/http";
import { Observable, throwError, of } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { Router } from "@angular/router";
import { SnackbarService } from "./shared/services/snackbar.service";
import { environment } from "../environments/environment";
import { UserStreamService } from "./shared/services/user-stream.service";
import { mapUserResponseTypeToUserType } from "./shared/utils";
import { UserResponseTypes, UserTypes } from "./shared/DTO/user";

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
    const apiUrl = environment.apiUrl;

    // Skip CSRF for the CSRF endpoint itself
    if (request.url.includes("/csrf-token")) {
      return next.handle(request);
    }

    const alreadyRetried = request.headers.get("x-retry") === "true";

    let userType: UserTypes | undefined;
    if (
      !request.url.includes("/login") &&
      !request.url.includes("/logout") &&
      !request.url.includes("/signup") &&
      !request.url.includes("/refresh")
    ) {
      userType = mapUserResponseTypeToUserType(
        this.userService.getCurrentUserFromStorage()?.type as UserResponseTypes,
      );
    }

    // Fetch CSRF token (force refresh if retrying)
    return this.userService.fetchCsrfToken(alreadyRetried).pipe(
      switchMap((csrfToken) => {
        const modifiedRequest = request.clone({
          withCredentials: true,
          setHeaders: {
            "X-CSRF-Token": csrfToken || "",
          },
        });

        return next.handle(modifiedRequest).pipe(
          catchError((error: HttpErrorResponse) => {
            // Retry once on 403 (CSRF mismatch)
            if (error.status === 403 && !alreadyRetried) {
              return this.userService.fetchCsrfToken(true).pipe(
                switchMap((newToken) => {
                  const retriedRequest = modifiedRequest.clone({
                    headers: modifiedRequest.headers
                      .set("X-CSRF-Token", newToken)
                      .set("x-retry", "true"),
                  });
                  return next.handle(retriedRequest);
                }),
              );
            }

            if (error.status === 401) {
              this.snackbar.openSnackbarWithAction(
                "Session expired. Please log in again.",
              );
              this.userService.clearUserData();

              if (!request.url.includes("/login")) {
                this.router.navigate(["/"]);
              }

              return throwError(() => error);
            }

            return throwError(() => error);
          }),
        );
      }),
    );
  }
}
