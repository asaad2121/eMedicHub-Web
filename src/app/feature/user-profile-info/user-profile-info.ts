import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
  FormControl,
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatDividerModule } from "@angular/material/divider";
import { MatChipsModule } from "@angular/material/chips";
import { MatMenuModule } from "@angular/material/menu";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";

import { ProfileService } from "../../shared/services/profile.service";
import { UserProfile } from "../../shared/DTO/userprofile";
import { UserResponseTypes, UserTypes } from "../../shared/DTO/user";
import { UserStreamService } from "../../shared/services/user-stream.service";
import { passwordStrengthValidator } from "./password-validator";
import { confirmPasswordValidator } from "./confirm-password-validator";
import { ApiResponse } from "../../shared/DTO/common";
import { SnackbarService } from "../../shared/services/snackbar.service";
import { EmhLoadingComponent } from "../../shared/components/emh-loading-component/emh-loading-component";
import { Router } from "@angular/router";

@Component({
  selector: "user-profile-info",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule,
    MatChipsModule,
    MatMenuModule,
    MatDatepickerModule,
    MatNativeDateModule,
    EmhLoadingComponent,
  ],
  templateUrl: "./user-profile-info.html",
  styleUrls: ["./user-profile-info.less"],
})
export class UserProfileInfo implements OnInit {
  loading = false;
  profileForm!: FormGroup;
  editAccount = false;
  editContact = false;
  passwordUpdated = false;
  hideCurrent = true;
  hideNew = true;
  hideConfirm = true;

  Id: string = "";
  name: string = "";
  type: string = "";
  userType: string = "";

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private userStreamService: UserStreamService,
    private snackbar: SnackbarService,
    private router: Router,
  ) {
    const storedUser = this.userStreamService.getCurrentUserFromStorage();
    this.Id = storedUser?.id || "";
    this.name = [storedUser?.first_name, storedUser?.last_name]
      .filter(Boolean)
      .join(" ");
    this.type = storedUser?.type || "";
  }

  ngOnInit() {
    this.profileForm = this.fb.group({
      firstName: new FormControl(
        { value: "", disabled: true },
        Validators.required,
      ),
      lastName: new FormControl(
        { value: "", disabled: true },
        Validators.required,
      ),
      dob: new FormControl({ value: null, disabled: true }),
      email: new FormControl({ value: "", disabled: true }, [
        Validators.required,
        Validators.email,
      ]),
      phone: new FormControl(
        { value: "+64 225626575", disabled: true },
        Validators.required,
      ),
      passwords: this.fb.group(
        {
          current: new FormControl({ value: "", disabled: false }),
          new: new FormControl(
            { value: "", disabled: true },
            {
              validators: [passwordStrengthValidator()],
              nonNullable: true,
            },
          ),
          confirm: new FormControl({ value: "", disabled: true }),
        },
        { validators: confirmPasswordValidator },
      ),
    });

    this.loadProfile();
  }

  get passwords(): FormGroup {
    return this.profileForm.get("passwords") as FormGroup;
  }

  loadProfile() {
    this.userType =
      this.type === UserResponseTypes.DOCTOR
        ? UserTypes.DOCTOR.toLowerCase()
        : UserTypes.PATIENT.toLowerCase();
    this.loading = true;
    this.profileService.getProfile(this.userType, this.Id).subscribe({
      next: (profile: UserProfile) => {
        this.loading = false;
        this.profileForm.patchValue({
          firstName: profile.first_name,
          lastName: profile.last_name,
          dob: profile.dob ? new Date(profile.dob) : null,
          email: profile.email,
          phone: profile.phone || "+64 225626575",
        });
      },
      error: (err) => {
        this.loading = false;
        console.error("Error fetching profile:", err);
      },
    });
  }

  onUpdatePassword() {
    this.passwordUpdated = true;

    if (this.passwords.valid) {
      const passwords = this.passwords.value;
      const data = {
        id: this.Id,
        oldPassword: passwords?.current ?? "",
        newPassword: passwords?.new ?? "",
      };

      this.profileService.resetProfile(this.userType, data).subscribe({
        next: (response: ApiResponse) => {
          this.snackbar.openSnackbarWithAction(response.message);
          this.reset();
        },
        error: (err) => {
          this.snackbar.openSnackbarWithAction(err);
          this.reset();
        },
      });
    }
  }

  onCancelPassword() {
    this.reset();
    if (this.userType.length) {
      this.router.navigate([`/${this.userType.toLowerCase()}/dashboard`]);
    }
  }

  checkCurrentPassword() {
    const currentValue = this.profileForm.get("passwords.current")?.value;
    if (currentValue) {
      this.profileForm.get("passwords.new")?.enable();
      this.profileForm.get("passwords.confirm")?.enable();
    } else {
      this.profileForm.get("passwords.new")?.disable();
      this.profileForm.get("passwords.confirm")?.disable();
    }
  }

  reset() {
    const passwords = this.profileForm.get("passwords") as FormGroup;
    passwords.reset({
      current: "",
      new: "",
      confirm: "",
    });
    passwords.get("new")?.disable();
    passwords.get("confirm")?.disable();
  }
}
