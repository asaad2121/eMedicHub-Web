import { Component, OnInit } from "@angular/core";
import { UserRoleService } from "../../services/user-role.service";
import { UserStreamService } from "../../services/user-stream.service";
import { User, UserResponseTypes, UserTypes } from "../../DTO/user";
import { DoctorDashboard } from "../../../feature/doctor-dashboard/doctor-dashboard";
import { PatientDashboard } from "../../../feature/patient-dashboard/patient-dashboard";

@Component({
  selector: "emh-dashboard-component",
  imports: [DoctorDashboard, PatientDashboard],
  templateUrl: "./emh-dashboard-component.html",
  styleUrl: "./emh-dashboard-component.less",
})
export class EmhDashboardComponent implements OnInit {
  public user!: User;

  UserResponseTypes = UserResponseTypes;

  constructor(private userStreamService: UserStreamService) {}

  ngOnInit() {
    this.user = this.userStreamService.currentUser$();

    if (!Object.keys(this.user).length) {
      this.user = this.userStreamService.getCurrentUserFromStorage();
    }
  }
}
