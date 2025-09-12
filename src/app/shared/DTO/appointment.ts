export type PatientAppointment = {
    id?: string;
    date: string;
    time: string;
    doctor_name: string;    // First + Last name of the doctor
    speciality: string;
};

export type DoctorAppointment = {
    id?: string;
    date: string;
    time: string;
    patient_name: string;   // First + Last name of the patient
};