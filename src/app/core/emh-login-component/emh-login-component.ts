import { Component, Input, OnInit } from "@angular/core";
import { EmhWelcomeCardComponent } from "./emh-welcome-card-component/emh-welcome-card-component";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatIcon } from "@angular/material/icon";
import { UserLoginDTO, UserTypes } from "../../shared/DTO/user";
import { UserStreamService } from "../../shared/services/user-stream.service";
import { SnackbarService } from "../../shared/services/snackbar.service";
import { UserRoleService } from "../../shared/services/user-role.service";
import { Router } from "@angular/router";

@Component({
  selector: "emh-login-component",
  imports: [
    EmhWelcomeCardComponent,
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIcon,
  ],
  templateUrl: "./emh-login-component.html",
  styleUrl: "./emh-login-component.less",
})
export class EmhLoginComponent implements OnInit {
  public loginForm!: FormGroup;

  public hidePassword = true;
  public toastMessage = "";

  // TODO: Implement a spinner later, maybe.
  public loading = false;

  public userType: UserTypes = UserTypes.DOCTOR;

  constructor(
    private fb: FormBuilder,
    private userStream: UserStreamService,
    private snackbar: SnackbarService,
    private userRoleService: UserRoleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const role = this.userRoleService.getRole();
    this.userType = role ?? UserTypes.DOCTOR;
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    });
  }

  public async onLogin() {
    let user: UserLoginDTO;

    const email = this.loginForm.get("email")?.value;
    const password = this.loginForm.get("password")?.value;

    this.loading = true;

    if (this.loginForm.valid && email && password) {
      try {
        user = await this.userStream.loginUserAndGetMesage(
          this.userType,
          email,
          password
        );
        this.toastMessage = user.message;

        this.router.navigate([`/${this.userType.toLowerCase()}/dashboard`]);
      } catch (error) {
        this.toastMessage = "Login failed. Invalid credentials.";
      }
    }
    this.snackbar.openSnackbarWithAction(this.toastMessage);
    this.loading = false;
  }
}
