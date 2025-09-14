import { Component, signal } from "@angular/core";
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";

import { MatSnackBarModule } from "@angular/material/snack-bar";
import { filter } from "rxjs";
import { UserStreamService } from "./shared/services/user-stream.service";
import { User } from "./shared/DTO/user";
import { EmhLoadingComponent } from "./shared/components/emh-loading-component/emh-loading-component";

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

  public loading = false;

  private user!: User;

  constructor(
    private router: Router,
    private userStreamService: UserStreamService,
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(async (event: any) => {
        const url = event.urlAfterRedirects;
        this.routerPath = url;

        this.showHeader = !(url === "/" || url.endsWith("/login"));

        if (this.user) {
          if (url === "/" || url === "") {
            this.loading = true;
            try {
              await this.userStreamService.getCurrentUserDetails(this.user);
              this.goHome();
            } finally {
              this.loading = false;
            }
          }
        }
      });
  }

  ngOnInit() {
    this.user = this.userStreamService.getCurrentUserFromStorage();
    this.fullName = [this.user?.first_name, this.user?.last_name]
      .filter((name) => name)
      .join(" ");
  }

  public goHome() {
    this.router.navigate([`${this.user.type}/dashboard`]);
  }
}
