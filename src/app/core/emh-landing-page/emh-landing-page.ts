import { Component, OnInit } from "@angular/core";
import { UserTypes } from "../../shared/DTO/user";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { UserRoleService } from "../../shared/services/user-role.service";
@Component({
  selector: "emh-landing-page",
  imports: [],
  templateUrl: "./emh-landing-page.html",
  styleUrl: "./emh-landing-page.less",
})
export class EmhLandingPage implements OnInit {
  userTypes = UserTypes;

  constructor(
    private router: Router,
    private userRoleService: UserRoleService,
  ) {}

  ngOnInit(): void {}

  loginAs(role: UserTypes) {
    if (role) {
      this.userRoleService.setRole(role);
      this.router.navigate([`/${role.toLowerCase()}/login`], {
        state: { role },
      });
    } else {
      this.router.navigate(["/"]);
    }
  }
}
