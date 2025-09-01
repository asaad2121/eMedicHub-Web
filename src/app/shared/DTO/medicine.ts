export type Medicine = {
    id: string;
    name: string;
    price: number;
    company?: string;
    prescription_required?: boolean;
    salt?: string;
}

export interface PatientMedicines {
    appointment_id: string,
    patient_id: string,
    doctor_id: string,
    pharma_id: string,
    medicines: PrescriptionItem[]
}

export type TimeSlot = {
    key: string;
    label: string;
    selected?: boolean;
}

export type PrescriptionMedicine = {
    selectedMedicine: Medicine | null;
    quantity: number;
    options: TimeSlot[];
    medicineInput?: string;
    filteredOptions?: Medicine[];
}

export interface PrescriptionItem {
    med_id: string,
    quantity: number,
    price: number,
    //timings: Timings,
    timings : {
        [key:string] : boolean
    }
}

export interface Timings {
    before_morning_med: boolean;
    after_morning_med: boolean;
    before_evening_med: boolean;
    after_evening_med: boolean;
    before_dinner_med: boolean;
    after_dinner_med: boolean;
}