import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import { SnackbarService } from "./shared/services/snackbar.service";

@Injectable()
export class Http_Interceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private snackbar: SnackbarService,
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    request = request.clone({
      withCredentials: true,
    });

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          const message = "Session expired. Redirecting to home page";
          console.error(message);
          this.snackbar.openSnackbarWithAction(message);
          this.router.navigate(["/"]);
        }

        return throwError(() => error);
      }),
    );
  }
}
