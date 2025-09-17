export type PatientAppointment = {
    id?: string;
    date: string;
    time: string;
    doctor_name: string;    
    speciality: string;
};

export type DoctorAppointment = {
    id?: string;
    date: string;
    time: string;
    patient_name: string;  
};


export type AppointmentDetails = {
    appointment_id: string,
    date: string,
    start_time: string,
    end_time: string,
    note: string,
    doctor : Doctor,
    patient : Patient
}

export type Doctor = {
    id: string,
    name:string,
    speciality:string
}
      
export type Patient = {
    id: string,
    name: string,
    age: number,
    blood_grp: string,
    phone_no: string,
    email: string,
    address: string
}       
            
        