import { Component, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";

import { MatSnackBarModule } from "@angular/material/snack-bar";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, MatSnackBarModule],
  templateUrl: "./app.html",
  styleUrl: "./app.less",
})
export class App {}
