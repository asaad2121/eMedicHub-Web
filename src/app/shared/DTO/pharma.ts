import { OrderStatus } from "./orders";

export type Pharma = {
  id: string;
  name: string;
};

export type PharmaDashboardData = {
  order_id: string;
  doctor_name: string;
  patient_name: string;
  order_status: OrderStatus;
  order_time: string;
}[];
