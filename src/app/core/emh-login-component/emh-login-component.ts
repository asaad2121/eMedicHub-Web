import { Component, Input, OnInit } from "@angular/core";
import { EmhWelcomeCardComponent } from "./emh-welcome-card-component/emh-welcome-card-component";
import { CommonModule, TitleCasePipe } from "@angular/common";
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
import { Router } from "@angular/router";
import { MatCheckbox } from "@angular/material/checkbox";
import { EmhLoadingComponent } from "../../shared/components/emh-loading-component/emh-loading-component";

@Component({
  selector: "emh-login-component",
  imports: [
    EmhWelcomeCardComponent,
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIcon,
    MatCheckbox,
    EmhLoadingComponent,
    TitleCasePipe,
  ],
  templateUrl: "./emh-login-component.html",
  styleUrl: "./emh-login-component.less",
})
export class EmhLoginComponent implements OnInit {
  public loginForm!: FormGroup;

  public hidePassword = true;
  public toastMessage = "";

  public loading = false;

  public userType: UserTypes = UserTypes.DOCTOR;

  // Expose enum to template
  UserTypes = UserTypes;

  constructor(
    private fb: FormBuilder,
    private userStream: UserStreamService,
    private snackbar: SnackbarService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const role = this.getRoleFromUrl();

    this.userType = role || UserTypes.DOCTOR;
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
      rememberMe: [false],
    });

    this.userStream.clearUserData();
  }

  public async onLogin() {
    let user: UserLoginDTO;

    const email = this.loginForm.get("email")?.value;
    const password = this.loginForm.get("password")?.value;
    const rememberMe = this.loginForm.get("rememberMe")?.value;

    this.loading = true;

    if (this.loginForm.valid && email && password) {
      try {
        user = await this.userStream.loginUserAndGetMessage(
          this.userType,
          email,
          password,
          rememberMe,
        );
        this.toastMessage = user.message;

        this.router.navigate([`/${this.userType.toLowerCase()}/dashboard`]);
      } catch (error) {
        this.toastMessage = "Login failed. Invalid credentials.";
      }
    } else {
      this.toastMessage = "Please fill in all fields.";
    }
    this.snackbar.openSnackbarWithAction(this.toastMessage);
    this.loading = false;
  }

  private getRoleFromUrl(): UserTypes {
    let role: string;

    const state = this.router.getCurrentNavigation()?.extras.state;

    if (state && state["role"]) {
      role = state["role"];
    } else {
      role = this.router.url.split("/")[1];
    }

    if (
      !Object.values(UserTypes)
        .map((type) => type.toLowerCase())
        .includes(role)
    ) {
      this.router.navigate(["/error"]);
    }

    return role as UserTypes;
  }

  public onSignUp() {
    this.router.navigate(["/patients/sign-up"]);
  }
}
