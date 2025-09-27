import { Component } from "@angular/core";
import { UserStreamService } from "../../shared/services/user-stream.service";
import { Router } from "@angular/router";
import { mapUserResponseTypeToUserType } from "../../shared/utils";

@Component({
  selector: "emh-error-page-component",
  imports: [],
  templateUrl: "./emh-error-page-component.html",
  styleUrl: "./emh-error-page-component.less",
})
export class EmhErrorPageComponent {
  constructor(
    private userStreamService: UserStreamService,
    private router: Router,
  ) {}

  public goToDashboard() {
    const userType = mapUserResponseTypeToUserType(
      this.userStreamService.getCurrentUserFromStorage()?.type,
    );

    if (userType?.length) {
      this.router.navigate([`/${userType.toLowerCase()}/dashboard`]);
    } else {
      this.router.navigate(["/"]);
    }
  }
}
