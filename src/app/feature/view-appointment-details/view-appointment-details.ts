import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AppointmentService } from '../../shared/services/appointment.service';
import { UserResponseTypes} from '../../shared/DTO/user';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { UserStreamService } from '../../shared/services/user-stream.service';
import { AppointmentDetails } from '../../shared/DTO/appointment';
import { EmhLoadingComponent } from '../../shared/components/emh-loading-component/emh-loading-component';

@Component({
  selector: 'view-appointment-details',
  imports: [CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    EmhLoadingComponent
  ],
  templateUrl: './view-appointment-details.html',
  styleUrl: './view-appointment-details.less'
})
export class ViewAppointmentDetails implements OnInit {
  appointment!: AppointmentDetails;
  UserTypes = UserResponseTypes;
  userType : string = '';
  appointmentId: string | null = null;
  loading: boolean = false;

  constructor(private route: ActivatedRoute, 
    private router: Router, 
    private appointmentService: AppointmentService, 
    private userStreamService: UserStreamService) { }
  ngOnInit(): void {
    const storedUser = this.userStreamService.getCurrentUserFromStorage() as any;   
    const role  = storedUser?.type;    
    this.appointmentId = this.route.snapshot.paramMap.get('id');
    this.userType = role ?? UserResponseTypes.DOCTOR;
    this.getDetails();
  }
  getDetails() {   
    this.loading = true; 
    this.appointmentService.getAppointmentDetails(this.userType, this.appointmentId || '')
      .subscribe({
        next: (data: AppointmentDetails) => {
          this.loading = false;
          if (data) {                           
            this.appointment = data;            
          }
        },
        error: (err) => {
          this.loading = false;
          this.router.navigate(['/view-appointments']);
          console.error('Error fetching appointment details:', err);
        }
      });
  }

  onBack() {
    this.router.navigate(['/view-appointments']);
  }
  onCreateOrder() {    
    const id = this.appointment.appointment_id; 
    if(this.userType === UserResponseTypes.DOCTOR) {  
    this.router.navigate(['/add-new-order', id]);
    } 
    else {
      this.router.navigate(['/view-appointments']);
    }   
  }
}
