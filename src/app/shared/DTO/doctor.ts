export type TimeValue = {
  S: string;
};

export type DaySchedule = {
  M: {
    start: TimeValue;
    end: TimeValue;
  };
};

export type VisitingHours = {
  monday?: DaySchedule;
  tuesday?: DaySchedule;
  wednesday?: DaySchedule;
  thursday?: DaySchedule;
  friday?: DaySchedule;
  saturday?: DaySchedule;
  sunday?: DaySchedule;
};

export type Doctor = {
  id: string;
  first_name: string;
  last_name: string;
  name: string;
  dob: string;
  email: string;
  visiting_hours: VisitingHours;
};

export type DoctorsDTO = {
  success: boolean;
  message: string;
  data: {
    doctors: Doctor[];
    nextPatientId: string;
    idTypes: string[];
    bloodGroups: string[];
  };
};

export type DoctorDashboardAppointment = {
  id: string;
  doctor_id: string;
  patient_id: string;
  date: string;
  start_time: string;
  end_time: string;
  note: string;
};

export type DoctorDashboardData = {
  totalToday: string;
  completed: number;
  upcoming: number;
  appointments: DoctorDashboardAppointment[];
};
