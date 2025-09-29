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

    // Track if this request has already been retried
    const alreadyRetried = request.headers.get("x-retry") === "true";

    // Map user type once
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

    // Fetch CSRF token once per request
    return this.userService.fetchCsrfToken().pipe(
      // If CSRF fetch fails, still continue with empty token
      catchError((err) => {
        console.warn(
          "Failed to fetch CSRF token, continuing without token",
          err,
        );
        return of(""); // fallback token
      }),
      switchMap((csrfToken) => {
        const modifiedRequest = request.clone({
          withCredentials: true,
          setHeaders: {
            "X-CSRF-Token": csrfToken || "",
          },
        });

        return next.handle(modifiedRequest).pipe(
          catchError((error: HttpErrorResponse) => {
            // Retry once on 403
            if (error.status === 403 && userType && !alreadyRetried) {
              const retriedRequest = modifiedRequest.clone({
                headers: modifiedRequest.headers.set("x-retry", "true"),
              });

              // refresh session without another CSRF fetch
              return this.http
                .post(
                  `${apiUrl}/${userType}/auth/refresh`,
                  {},
                  { withCredentials: true },
                )
                .pipe(
                  switchMap(() => next.handle(retriedRequest)),
                  catchError((refreshError) => {
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
