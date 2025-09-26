import { AppointmentDetails } from "./appointment";
import { Order } from "./orders";

export type Patient = {
  id: string;
  first_name: string;
  last_name: string;
  dob: string;
  phone_no: string;
  email: string;
  password?: string; // Added when new patient is created by doc
  blood_grp?: string;
  gp_id?: string; // ID of practitioner
  address: string;
  id_type: string;
  id_number: string;
  last_gp_visited: string;
};

export type BookingDetails = {
  patient_id: string;
  doctor_id: string;
  date: string;
  start_time: string;
  note: string;
};

export type DashboardAppointmentDetails = {
  id: string;
  doctor_id: string;
  date: string;
  start_time: string;
  end_time: string;
  notes: string;
  doctor_name: string;
  speciality: string;
};

export type PatientDashboardData = {
  patient_id: string;
  appointments: DashboardAppointmentDetails[];
  ordersReady: Order[];
  ordersNotReady: Order[];
};
