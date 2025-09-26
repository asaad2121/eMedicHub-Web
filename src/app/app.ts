import { Component, effect, OnInit, signal } from "@angular/core";
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";

import { MatSnackBarModule } from "@angular/material/snack-bar";
import { filter } from "rxjs";
import { UserStreamService } from "./shared/services/user-stream.service";
import { User, UserResponseTypes } from "./shared/DTO/user";
import { EmhLoadingComponent } from "./shared/components/emh-loading-component/emh-loading-component";
import { mapUserResponseTypeToUserType } from "./shared/utils";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "app-root",
  imports: [RouterOutlet,
    MatSnackBarModule,
    EmhLoadingComponent,
    MatMenuModule,
    MatButtonModule
  ],
  templateUrl: "./app.html",
  styleUrl: "./app.less",
})
export class App {
  showHeader = true;
  fullName: string = "";
  routerPath: string = "";
  userIcon = '';
  public loading = signal(true);
  private user!: User;
  userResponseType = UserResponseTypes;

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

  ngOnInit() {
    this.setUserIcon();
  }

  setUserIcon() {
    const user = this.userStreamService.getCurrentUserFromStorage();
    switch (user?.type) {
      case UserResponseTypes.DOCTOR:
        this.userIcon = 'assets/images/steth.png';
        break;
      case UserResponseTypes.PATIENT:
        this.userIcon = 'assets/images/person.png';
        break;
      case UserResponseTypes.PHARMACY:
        this.userIcon = 'assets/images/medicine.png';
        break;
      default:
        this.userIcon = 'assets/images/person.png';
    }
  }


  public goHome() {
    const userType = mapUserResponseTypeToUserType(
      this.user.type,
    ).toLowerCase();

    this.router.navigate([`${userType}/dashboard`]);
  }

  viewProfile() {
    this.router.navigate([`/${this.user.type.toLowerCase()}/profile`]);
  }
  logout() {
    this.userStreamService.clearUserData();
    this.router.navigate(['/'])
  }
}
