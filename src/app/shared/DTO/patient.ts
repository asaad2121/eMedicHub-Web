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
