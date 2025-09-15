import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AppointmentService } from '../../shared/services/appointment.service';
import { UserResponseTypes} from '../../shared/DTO/user';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { UserStreamService } from '../../shared/services/user-stream.service';

@Component({
  selector: 'view-appointment-details',
  imports: [CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule
  ],
  templateUrl: './view-appointment-details.html',
  styleUrl: './view-appointment-details.less'
})
export class ViewAppointmentDetails implements OnInit {
  appointment: any = null;
  UserTypes = UserResponseTypes;
  userType : string = '';
  appointmentId: string | null = null;
  
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
    this.appointmentService.getAppointmentDetails(this.userType, this.appointmentId || '')
      .subscribe({
        next: (res: any) => {
          if (res) {            
            this.appointment = res.data;            
          }
        },
        error: (err) => {
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
