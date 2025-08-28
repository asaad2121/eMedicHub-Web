import { Component, signal } from "@angular/core";
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";

import { MatSnackBarModule } from "@angular/material/snack-bar";
import { filter } from "rxjs";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, MatSnackBarModule],
  templateUrl: "./app.html",
  styleUrl: "./app.less",
})
export class App {
  showHeader = true;
  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects;

        // Hide header only if URL ends with '/login' or is root '/'
        this.showHeader = !(url === '/' || url.endsWith('/login'));
      });
  }
}

