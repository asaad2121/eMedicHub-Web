import { Component, OnInit } from "@angular/core";
import { UserStreamService } from "../../services/user-stream.service";
import { User, UserResponseTypes } from "../../DTO/user";
import { DoctorDashboard } from "../../../feature/doctor-dashboard/doctor-dashboard";
import { PatientDashboard } from "../../../feature/patient-dashboard/patient-dashboard";
import { PharmaDashboard } from "../../../feature/pharma-dashboard/pharma-dashboard";
import { DoctorDashboardData } from "../../DTO/doctor";
import { PatientDashboardData } from "../../DTO/patient";
import { PharmaDashboardData } from "../../DTO/pharma";
import { EmhLoadingComponent } from "../emh-loading-component/emh-loading-component";

@Component({
  selector: "emh-dashboard-component",
  imports: [
    DoctorDashboard,
    PatientDashboard,
    PharmaDashboard,
    EmhLoadingComponent,
  ],
  templateUrl: "./emh-dashboard-component.html",
  styleUrl: "./emh-dashboard-component.less",
})
export class EmhDashboardComponent implements OnInit {
  public user!: User;

  public doctorDashboardData!: DoctorDashboardData;
  public patientDashboardData!: PatientDashboardData;
  public pharmaDashboardData!: any;

  public isMobile = false;

  public loading = false;
  public isUserLoading = false;

  UserResponseTypes = UserResponseTypes;

  constructor(private userStreamService: UserStreamService) {}

  async ngOnInit() {
    this.loading = true;

    this.isUserLoading = true;
    this.user = await this.userStreamService.getCurrentUserDetails(this.user);
    this.isUserLoading = false;

    this.userStreamService.getUserDashboardData(this.user).then((data) => {
      if (this.user.type === UserResponseTypes.DOCTOR) {
        this.doctorDashboardData = { ...data } as DoctorDashboardData;
      } else if (this.user.type === UserResponseTypes.PATIENT) {
        this.patientDashboardData = { ...data } as PatientDashboardData;
      } else {
        this.pharmaDashboardData = Object.values({
          ...data,
        } as PharmaDashboardData);
      }
      this.loading = false;
    });

    // For phones
    this.isMobile = window.innerWidth < 768;
    window.addEventListener("resize", () => {
      this.isMobile = window.innerWidth < 768;
    });

    if (!Object.keys(this.user).length) {
      this.user = this.userStreamService.getCurrentUserFromStorage();
    }
  }
}
