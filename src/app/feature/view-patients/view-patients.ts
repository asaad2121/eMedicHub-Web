import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { PatientService } from "../../shared/services/patient-service";
import { UserStreamService } from "../../shared/services/user-stream.service";
import { CommonModule, DatePipe } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatOptionModule } from "@angular/material/core";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { MatTableModule } from "@angular/material/table";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { PatientFilterDialog } from "../../shared/components/dialog/patient-filter-dialog/patient-filter-dialog";
import { Patient } from "../../shared/DTO/patient";
import { RouterModule } from "@angular/router";
import { PatientDetailsDialog } from "../../shared/components/dialog/patient-details-dialog/patient-details-dialog";

@Component({
  selector: "view-patients",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    MatOptionModule,
    MatAutocompleteModule,
    MatIconModule,
    MatCardModule,
    MatPaginatorModule,
    MatTableModule,
    MatProgressSpinnerModule,
    RouterModule,
  ],
  templateUrl: "./view-patients.html",
  styleUrls: ["./view-patients.less"],
  providers: [DatePipe],
})
export class ViewPatients implements OnInit {
  columns = [
    { key: "id", label: "Patient ID" },
    { key: "first_name", label: "First Name" },
    { key: "last_name", label: "Last Name" },
    { key: "dob", label: "Date of Birth" },
    { key: "age", label: "Age" },
    { key: "blood_grp", label: "Blood Group" },
    { key: "gp_name", label: "Doctor Name" },
  ];
  displayedColumns = [...this.columns.map((c) => c.key), "actions"];

  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  selectedPatient: Patient | null = null;

  totalPatients = 0;
  pageSize = 10;
  currentPage = 1;
  loading = false;

  searchControl = new FormControl("");

  doctorId = "";
  doctorName = "";
  type = "";
  searchText = "";

  constructor(
    private dialog: MatDialog,
    private patientService: PatientService,
    private userStreamService: UserStreamService,
    private datePipe: DatePipe,
  ) {
    const storedUser =
      this.userStreamService.getCurrentUserFromStorage() as any;
    this.doctorId = storedUser?.id;
    this.doctorName = [storedUser?.first_name, storedUser?.last_name]
      .filter((n) => n)
      .join(" ");
    this.type = storedUser?.type;
  }

  ngOnInit(): void {
    this.loadPatients();
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query: any) => {
          this.searchText = query;
          this.loading = true;
          return this.patientService.searchPatients(this.doctorId, query || "");
        }),
      )
      .subscribe({
        next: (res: {
          success: boolean;
          data: Patient[];
          totalPatients: number;
        }) => {
          this.loading = false;

          if (res.success) {
            if (res.data?.length) {
              res.data.forEach((p) => {
                if (p.dob) p.dob = this.formatDate(p.dob);
              });
            }
            this.patients = res.data || [];
            this.totalPatients = res.totalPatients || 0;
            this.selectedPatient = null;
          } else {
            this.patients = [];
            this.totalPatients = 0;
          }
        },
        error: () => {
          this.loading = false;
          this.patients = [];
          this.totalPatients = 0;
        },
      });
  }

  openFilter() {
    const dialogRef = this.dialog.open(PatientFilterDialog, {
      width: "400px",
      data: {
        selectedAge: "",
        selectedBlood: "",
        selectedTime: "",
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.applyPatientFilters(result);
      }
    });
  }

  applyPatientFilters(result: any) {
    const allEmpty = Object.entries(result).every(
      ([key, value]) => value === "",
    );
    if (result.time) {
      result.time = this.getFilterDate(result.time);
    }
    this.loading = true;
    if (!allEmpty) {
      this.patientService
        .getPatientsByFilter(
          this.doctorId,
          result,
          this.pageSize,
          this.currentPage,
          this.searchText,
        )
        .subscribe({
          next: (res: {
            success: boolean;
            data: Patient[];
            totalPatients: number;
          }) => {
            this.loading = false;
            if (res.success) {
              if (res.data?.length) {
                res.data.forEach((p) => {
                  if (p.dob) p.dob = this.formatDate(p.dob);
                });
              }

              this.patients = res.data || [];
              this.totalPatients = res.totalPatients || 0;
              this.selectedPatient = null;
            } else {
              this.patients = [];
              this.totalPatients = 0;
            }
          },
          error: (err) => {
            this.loading = false;
            console.error("Error fetching filtered patients", err);
            this.patients = [];
            this.totalPatients = 0;
          },
        });
    } else {
      this.loadPatients();
    }
  }

  getFilterDate(option: string) {
    const today = new Date();
    let fromDate: Date | null = null;

    switch (option) {
      case "Last week":
        fromDate = new Date(today.setDate(today.getDate() - 7));
        break;
      case "Last month":
        fromDate = new Date(today.setMonth(today.getMonth() - 1));
        break;
      case "Last 3 months":
      case "Older than 3 months":
        fromDate = new Date(today.setMonth(today.getMonth() - 3));
        break;
    }

    return fromDate ? this.datePipe.transform(fromDate, "yyyy-MM-dd") : null;
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.loadPatients();
  }

  loadPatients() {
    this.loading = true;
    this.patientService
      .getPatients(
        this.doctorId,
        this.currentPage,
        this.pageSize,
        this.searchText,
      )
      .subscribe(
        (res: { success: boolean; data: Patient[]; totalPatients: number }) => {
          this.loading = false;
          if (res.success) {
            if (res.data?.length) {
              res.data.forEach((p) => {
                if (p.dob) p.dob = this.formatDate(p.dob);
              });
            }
            this.patients = res.data || [];
            this.totalPatients = res.totalPatients || 0;
            this.selectedPatient = null;
          } else {
            this.patients = [];
            this.totalPatients = 0;
          }
        },
        () => {
          this.loading = false;
          this.patients = [];
          this.totalPatients = 0;
        },
      );
  }

  openPatientDialog(patient: Patient) {
    const formattedData = Object.fromEntries(
      Object.entries(patient).map(([key, value]) => [
        key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        value,
      ]),
    );
    this.dialog.open(PatientDetailsDialog, {
      width: "400px",
      data: formattedData,
    });
  }

  formatDate(dob: string | Date) {
    return this.datePipe.transform(new Date(dob), "yyyy-MM-dd") || "";
  }
}
