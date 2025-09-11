import { CommonModule, NgFor, NgIf } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatOptionModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatTooltipModule } from "@angular/material/tooltip";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  of,
  startWith,
  Subject,
  switchMap,
} from "rxjs";
import {
  Medicine,
  PrescriptionMedicine,
  TimeSlot,
} from "../../shared/DTO/medicine";
import { MedicineService } from "../../shared/services/medicine.service";
import { SnackbarService } from "../../shared/services/snackbar.service";
import { ApiResponse } from "../../shared/DTO/common";
import { SLOT_CONFIGS } from "../../shared/constants/time-slot";

@Component({
  selector: "add-new-order",
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
  ],
  templateUrl: "./add-new-order.html",
  styleUrl: "./add-new-order.less",
})
export class AddNewOrder {
  searchControl = new FormControl();
  allMedicines: Medicine[] = [];
  private searchTerms = new Subject<{
    term: string;
    med: PrescriptionMedicine;
  }>();
  selectedPatient = { id: "PAT-001", name: "Mary Francis" };
  SLOT_OPTIONS: TimeSlot[] = SLOT_CONFIGS.map((c) => ({
    ...c,
    selected: false,
  }));
  medicines: PrescriptionMedicine[] = [
    {
      selectedMedicine: null,
      quantity: 1,
      options: this.SLOT_OPTIONS.map((slot) => ({ ...slot })),
      medicineInput: "",
      filteredOptions: [],
    },
  ];
  totalPrice = 0;
  searchMessage: string = "";

  constructor(
    private medicineService: MedicineService,
    private snackbar: SnackbarService,
  ) {
    this.searchTerms
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(({ term, med }) =>
          this.medicineService.searchMedicines(term).pipe(
            catchError((err) => {
              console.error("API Error", err);
              med.filteredOptions = [];
              return of([]);
            }),
            map((results) => ({ results, med })),
          ),
        ),
      )
      .subscribe(({ results, med }) => {
        med.filteredOptions = results;
        this.allMedicines = results;
        if (med.filteredOptions.length === 0 && med.medicineInput) {
          this.searchMessage = "No results found";
        }
      });
    this.addMedicine();
  }

  ngOnInit(): void {
    this.medicines = [];
    this.addMedicine();
  }

  addMedicine() {
    if (!this.selectedPatient) return;
    this.medicines.push({
      selectedMedicine: null,
      quantity: 1,
      options: this.SLOT_OPTIONS.map((slot) => ({ ...slot })),
      medicineInput: "",
      filteredOptions: [],
    });
  }

  filterMedicines(med: PrescriptionMedicine) {
    const value = med.medicineInput?.trim() || "";
    this.updateSearchMessage(med, value);
    if (value.length >= 4) {
      this.searchTerms.next({ term: value, med });
    } else {
      med.filteredOptions = [];
      this.allMedicines = [];
      med.selectedMedicine = null;
    }
  }

  updateSearchMessage(med: any, value?: string): void {
    if (value && value?.length < 4 && value.length !== 0) {
      this.searchMessage = "Enter at least 4 letters to search";
    } else {
      this.searchMessage = "";
    }
  }

  onMedicineSelected(
    event: MatAutocompleteSelectedEvent,
    med: PrescriptionMedicine,
  ) {
    const selectedName = event.option.value;
    const selectedMed =
      this.allMedicines.find((m) => m.name === selectedName) || null;
    med.selectedMedicine = selectedMed;
    med.medicineInput = selectedName;
    this.updateTotalPrice(); // recalc total
    this.searchMessage = "";
  }

  changeQuantity(med: PrescriptionMedicine, increase: boolean) {
    if (!med.selectedMedicine) return;
    med.quantity = Math.max(1, med.quantity + (increase ? 1 : -1));
    this.updateTotalPrice();
  }

  toggleOption(med: PrescriptionMedicine, option: TimeSlot) {
    option.selected = !option.selected;
  }

  removeMedicine(med: PrescriptionMedicine) {
    this.medicines = this.medicines.filter((m) => m !== med);
    this.updateTotalPrice();
  }

  updateTotalPrice() {
    this.totalPrice = this.medicines.reduce(
      (sum, med) => sum + (med.selectedMedicine?.price ?? 0) * med.quantity,
      0,
    );
  }

  generatePrescriptionOutput() {
    return {
      medicines: this.medicines
        .filter((med) => med.selectedMedicine)
        .map((med) => ({
          med_id: med.selectedMedicine!.id,
          quantity: med.quantity,
          price: med.selectedMedicine!.price,
          timings: med.options
            .filter((opt) => opt.selected)
            .reduce(
              (acc, opt) => {
                acc[opt.key] = true;
                return acc;
              },
              {} as { [key: string]: boolean },
            ),
        })),
    };
  }

  /** Submit */
  submit() {
    const { medicines } = this.generatePrescriptionOutput();
    const res = {
      appointment_id: "APT-0001",
      patient_id: "PAT-0001",
      doctor_id: "DOC-005",
      pharma_id: "PHAR-001",
      medicines,
    };
    this.medicineService.addMedicine(res).subscribe({
      next: (response: ApiResponse) => {
        if (response.success)
          this.snackbar.openSnackbarWithAction(response.message);
        this.reset();
      },
      error: (err) => {
        this.snackbar.openSnackbarWithAction(err.message);
        this.reset();
      },
    });
  }

  reset() {
    this.medicines = [];
    this.addMedicine();
  }

  /** Rules */
  canAddMoreMedicines() {
    return true;
  }

  canSubmit() {
    return (
      !!this.selectedPatient &&
      this.medicines.length > 0 &&
      this.medicines.every(
        (m) => m.selectedMedicine && m.options.some((o) => o.selected),
      )
    );
  }
}
