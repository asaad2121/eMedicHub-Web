import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';
import { DoctorAppointment, PatientAppointment } from '../../shared/DTO/appointment';
import { UserStreamService } from '../../shared/services/user-stream.service';
import { AppointmentService } from '../../shared/services/appointment.service';
import { UserResponseTypes, UserTypes } from '../../shared/DTO/user';
import { EmhLoadingComponent } from '../../shared/components/emh-loading-component/emh-loading-component';

type Appointment = PatientAppointment | DoctorAppointment;

@Component({
  selector: 'view-appointments',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatCardModule,
    MatPaginatorModule,
    MatTableModule,
    MatProgressSpinnerModule,
    RouterModule,
    EmhLoadingComponent
  ],
  templateUrl: './view-appointments.html',
  styleUrls: ['./view-appointments.less'],
  providers: [DatePipe]
})
export class ViewAppointments implements OnInit {
  columns: { key: string, label: string }[] = [];
  displayedColumns: string[] = [];
  appointments: Appointment[] = []
  totalAppointments = 0;
  pageSize = 10;
  currentPage = 1;
  loading = false;

  Id = '';
  name = '';
  type = '';
  UserTypes = UserResponseTypes;
  UserType = UserTypes;
    
  constructor(
    private appointmentService: AppointmentService,
    private userStreamService: UserStreamService,
    private datePipe: DatePipe,
    private router: Router,    
  ) {
    const storedUser = this.userStreamService.getCurrentUserFromStorage() as any;
    this.Id = storedUser?.id;
    this.name = [storedUser?.first_name, storedUser?.last_name].filter(n => n).join(' ');
    this.type = storedUser?.type;  
  }

  ngOnInit(): void {
    this.setColumns();
    this.getAppointments();
  }

  setColumns() {
    if (this.type === UserResponseTypes.PATIENT) {
      this.columns = [
        { key: 'date', label: 'Date' },
        { key: 'start_time', label: 'Time' },
        { key: 'doctor_name', label: 'Doctor' },
        { key: 'speciality', label: 'Speciality' }
      ];
      this.appointments = [] as PatientAppointment[];
    } else if (this.type === UserResponseTypes.DOCTOR) {
      this.columns = [
        { key: 'date', label: 'Date' },
        { key: 'start_time', label: 'Time' },
        { key: 'patient_name', label: 'Patient' }
      ];
      this.appointments = [] as DoctorAppointment[];
    }
    this.displayedColumns = [...this.columns.map(c => c.key), 'actions'];
  }

  getAppointments() {
    this.loading = true;    
    this.appointmentService.getAppointments(this.type, this.Id, this.currentPage, this.pageSize)
      .subscribe({
        next: (res) => {
          this.loading = false;

          if (res.success && res.data?.length) {

            res.data.forEach((p: any) => {
              if (p.date) p.date = this.formatDate(p.date);
            });
            // Assign based on type
            if (this.type === 'patient') {
              this.appointments = res.data as PatientAppointment[];
            } else {
              this.appointments = res.data as DoctorAppointment[];

            }
            this.totalAppointments = this.totalAppointments || 0;
          } else {
            this.appointments = [];
            this.totalAppointments = 0;
          }
        },
        error: () => {
          this.loading = false;
          this.appointments = [];
          this.totalAppointments = 0;
        }
      });
  }

  formatDate(dob: string | Date) {
    return this.datePipe.transform(new Date(dob), 'yyyy-MM-dd') || '';
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.getAppointments();
  }

  onView(appointment: Appointment) {
    if (appointment.id) {
      this.router.navigate(['/appointment-details', appointment.id]);      
    }
  }
}

