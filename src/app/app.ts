import { Component, effect, OnInit, signal } from "@angular/core";
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";

import { MatSnackBarModule } from "@angular/material/snack-bar";
import { filter } from "rxjs";
import { UserStreamService } from "./shared/services/user-stream.service";
import { User } from "./shared/DTO/user";
import { EmhLoadingComponent } from "./shared/components/emh-loading-component/emh-loading-component";
import { mapUserResponseTypeToUserType } from "./shared/utils";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, MatSnackBarModule, EmhLoadingComponent],
  templateUrl: "./app.html",
  styleUrl: "./app.less",
})
export class App {
  showHeader = true;
  fullName: string = "";
  routerPath: string = "";

  public loading = signal(true);
  private user!: User;

  constructor(
    private router: Router,
    private userStreamService: UserStreamService,
  ) {
    const csrfTokenReady = signal(false);

    this.userStreamService.setCsrfToken().finally(() => {
      csrfTokenReady.set(true);
      this.loading.set(false);
    });

    effect(async () => {
      if (csrfTokenReady()) {
        this.user = this.userStreamService.currentUser$();

        if (!this.user.id && this.routerPath !== "/") {
          await this.userStreamService.getCurrentUserDetails({} as User);
        }

        this.fullName =
          this.user.name ||
          [this.user.first_name, this.user.last_name]
            .filter((name) => name)
            .join(" ");
      }
    });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(async (event: any) => {
        const url = event.urlAfterRedirects;
        this.routerPath = url;

        this.showHeader = !(
          url === "/" ||
          url.endsWith("/login") ||
          url.endsWith("/sign-up")
        );

        if (csrfTokenReady() && this.user.type) {
          if (url === "/" || url === "") {
            this.loading.set(true);
            try {
              await this.userStreamService.getCurrentUserDetails(this.user);
              this.goHome();
            } finally {
              this.loading.set(false);
            }
          }
        }
      });
  }

  public goHome() {
    const userType = mapUserResponseTypeToUserType(
      this.user.type,
    ).toLowerCase();

    this.router.navigate([`${userType}/dashboard`]);
  }
}
