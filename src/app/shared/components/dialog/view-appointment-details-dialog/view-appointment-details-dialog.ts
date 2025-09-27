import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { RouterModule, Router } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { EmhLoadingComponent } from "../../emh-loading-component/emh-loading-component";
import { AppointmentDetails } from "../../../DTO/appointment";
import { UserResponseTypes } from "../../../DTO/user";
import { MatIconModule } from "@angular/material/icon";
import { MatDialogModule } from '@angular/material/dialog';
@Component({
  selector: "view-appointment-details-dialog",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    EmhLoadingComponent,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: "./view-appointment-details-dialog.html",
  styleUrls: ["./view-appointment-details-dialog.less"]
})
export class ViewAppointmentDetailsDialog implements OnInit {
  appointment!: AppointmentDetails;
  UserTypes = UserResponseTypes;
  userType: string = '';
  appointmentId: string = '';
  loading: boolean = false;
  objectKeys = Object.keys;

  dataObject: any = {};
  constructor(
    private router: Router,
    private dialogRef: MatDialogRef<ViewAppointmentDetailsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.userType = data?.type ?? UserResponseTypes.DOCTOR;
    this.appointmentId = data?.appointmentId ?? '';
  }

  ngOnInit(): void {
    this.loading = !this.data;
  }

  onBack() {
    this.dialogRef.close();
  }

  onCreateOrder() {   
    if (this.userType === UserResponseTypes.DOCTOR) {
      this.router.navigate(['/add-new-order', this.data.data['Appointment ID']]);
    }
    this.dialogRef.close();
  }
}
