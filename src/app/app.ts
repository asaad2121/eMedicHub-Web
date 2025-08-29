import { Component, signal } from "@angular/core";
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";

import { MatSnackBarModule } from "@angular/material/snack-bar";
import { filter } from "rxjs";
import { UserStreamService } from "./shared/services/user-stream.service";


@Component({
  selector: "app-root",
  imports: [RouterOutlet, MatSnackBarModule],
  templateUrl: "./app.html",
  styleUrl: "./app.less",
})
export class App {
  showHeader = true;  
  fullName : string = '';
  constructor(private router: Router, private userStreamService:UserStreamService) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects;

        // Hide header only if URL ends with '/login' or is root '/'
        this.showHeader = !(url === '/' || url.endsWith('/login'));
      });
  }

  ngOnInit() {
    const storedUser = this.userStreamService.getCurrentUserFromStorage() as any;
    this.fullName = [storedUser.first_name, storedUser.last_name].filter(name => name).join(' ');
  }
}

