type MedicineTimings = {
  after_morning_med: boolean;
  before_dinner_med: boolean;
  after_dinner_med: boolean;
  before_evening_med: boolean;
  after_evening_med: boolean;
  before_morning_med: boolean;
};

export enum OrderStatus {
  CREATED = "Created",
  READY = "Ready",
  COLLECTED = "Collected",
}

export type Order = {
  id: string;
  order_id: string;
  quantity: number;
  appointment_id: string;
  status: OrderStatus;
  doctor_id: string;
  pharma_id: string;
  patient_id: string;
  timings: {
    M: MedicineTimings;
  };
  time: string;
  med_id: string;
  medicine_name: string;
  price: number;

  doctor_name: string;
  patient_name: string;
  pharma_name: string;
};

export type GroupedOrder = {
  appointment_id: string;
  order_ids: string[];
  doctor_name: string;
  pharma_name: string;
  patient_name: string;
  status: OrderStatus;
  total_price: number;
};

export type OrderResponse = {
  success: boolean;
  currentPageNo: number;
  limit: number;
  totalOrders: number;
  data: Order[];
};
