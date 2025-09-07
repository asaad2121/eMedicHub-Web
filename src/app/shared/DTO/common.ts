export type ApiResponse = {
  success: boolean;
  message: string;
  error?: {
    type: string;
    value: string;
    msg: string;
    path: string;
    location: string;
  }[];
};
