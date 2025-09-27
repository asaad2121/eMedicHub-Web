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
import { AppointmentDetails, DoctorAppointment, PatientAppointment } from '../../shared/DTO/appointment';
import { UserStreamService } from '../../shared/services/user-stream.service';
import { AppointmentService } from '../../shared/services/appointment.service';
import { UserResponseTypes, UserTypes } from '../../shared/DTO/user';
import { EmhLoadingComponent } from '../../shared/components/emh-loading-component/emh-loading-component';
import { ViewAppointmentDetailsDialog } from '../../shared/components/dialog/view-appointment-details-dialog/view-appointment-details-dialog';
import { MatDialog } from '@angular/material/dialog';
import { ViewAppointmentDetails } from '../view-appointment-details/view-appointment-details';

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
    EmhLoadingComponent
  ],
  templateUrl: './view-appointments.html',
  styleUrls: ['./view-appointments.less'],
  providers: [DatePipe]
})
export class ViewAppointments implements OnInit {
  //@ViewChild(MatPaginator) paginator!: MatPaginator;
  columns: { key: string, label: string }[] = [];
  displayedColumns: string[] = [];
  appointments: Appointment[] = []
  totalAppointments = 0;
  pageSize = 10;
  currentPage = 1;
  loading = false;
  loadingDialog = false;
  Id = '';
  name = '';
  type = '';
  UserTypes = UserResponseTypes;
  UserType = UserTypes;
  searchText = '';
  filteredAppointments: Appointment[] = [];
  pagedAppointments : Appointment[] = [];
  constructor(
    private appointmentService: AppointmentService,
    private userStreamService: UserStreamService,
    private datePipe: DatePipe,    
    private dialog: MatDialog
  ) {
    const storedUser = this.userStreamService.getCurrentUserFromStorage();
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
    console.log('sixe', this.type, this.Id, this.currentPage, this.pageSize);
    this.loading = true;
    this.appointmentService
      .getAppointments(this.type, this.Id, this.currentPage, this.pageSize)
      .subscribe({
        next: (data) => {
          this.loading = false;
          if (data?.length > 0) {
            data.forEach((p: any) => {
              if (p.date) p.date = this.formatDate(p.date);
            });
            this.appointments = data;
            this.filteredAppointments = [...this.appointments]; // initialize filtered list
            this.totalAppointments = this.appointments.length;
            this.setPagedAppointments();
          } else {
            this.appointments = [];
            this.filteredAppointments = [];
            this.totalAppointments = 0;
          }
        },
        error: () => {
          this.loading = false;
          this.appointments = [];
          this.filteredAppointments = [];
          this.totalAppointments = 0;
        }
      });
  }

 
  searchOrdersByPatient(searchValue: string) {
    if (!searchValue) {
      this.filteredAppointments = [...this.appointments];      
    } else {
      const lower = searchValue.toLowerCase();
      this.filteredAppointments = this.appointments.filter((a: any) => {
        if (this.type === UserResponseTypes.PATIENT) {
          return a.doctor_name?.toLowerCase().includes(lower) ||
                 a.speciality?.toLowerCase().includes(lower);
        } else if (this.type === UserResponseTypes.DOCTOR) {
          return a.patient_name?.toLowerCase().includes(lower);
        }
        return false;
      });
    }
    this.totalAppointments = this.filteredAppointments.length;
    this.currentPage = 1;
    this.setPagedAppointments();
  }

  onSearchChange(value: string) {
    this.searchOrdersByPatient(value);
  }
  formatDate(dob: string | Date) {
    return this.datePipe.transform(new Date(dob), 'yyyy-MM-dd') || '';
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.setPagedAppointments();   
  }

  setPagedAppointments() {
  const startIndex = (this.currentPage - 1) * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  this.pagedAppointments = this.filteredAppointments.slice(startIndex, endIndex);
}

  onView(appointment: Appointment) {   
    this.openAppointmentsDialog(appointment.id || '')
  }

  openAppointmentsDialog(id: string) {
    if (!id) return;
      this.loadingDialog = true;
      this.appointmentService.getAppointmentDetails(this.type, id).subscribe({
      next: (data) => {
        this.loadingDialog = false;
        if (!data) return;        
        const formattedData = this.formatAppointmentDetails(data);        
        this.dialog.open(ViewAppointmentDetailsDialog, {
          width: '800px',
          maxHeight: '90vh',
          panelClass: 'custom-dialog-container',
          data: { data: formattedData, type: this.type }
        });
      },
      error: (err) => {
        this.loadingDialog = false;
        console.error('Error fetching appointment details:', err);
      }
    });
  }

  formatAppointmentDetails(data: AppointmentDetails): any {
    const mappedData = {
      'Appointment ID': data?.appointment_id,
      'Date & Time': `${data?.date} ${data?.start_time} - ${data?.end_time}`,
      'Notes': data?.note || 'N/A',
      'Doctor ID': data?.doctor?.id || 'N/A',
      'Doctor Name': data?.doctor?.name || 'N/A',
      'Speciality': data?.doctor?.speciality || 'N/A',
      'Patient Name': data?.patient?.name || 'N/A',
      'Patient Age': data?.patient?.age || 'N/A',
      'Blood Group': data.patient?.blood_grp || 'N/A',
      'Phone': data.patient?.phone_no || 'N/A',
      'Email': data.patient?.email || 'N/A',
      'Address': data.patient?.address || 'N/A'
    };

    return mappedData;
  }
}

