import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class SnackbarService {
  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
  ) {}

  public openSnackbarWithAction(
    message: string,
    action: string = "Close",
    duration: number = 5000,
  ): void {
    const isLoginOrRoot =
      this.router.url === "/" || this.router.url.endsWith("/login");
    const panelClass = isLoginOrRoot ? undefined : ["header-active"];

    this.snackBar.open(message, action, {
      duration: duration,
      verticalPosition: "top",
      horizontalPosition: "right",
      panelClass: panelClass,
    });
  }
}
