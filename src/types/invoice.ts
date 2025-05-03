export interface Invoice {
  _id: string;
  userId: string;
  vendorName: string;
  productName: string;
  invoiceNumber: string;
  date: string;
  time: string;
  imeiSku: string;
  warrantyEndDate: string;
  fileUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data: T;
  token?: string;
  msg?: string;
}

export interface LoginResponse {
  token: string;
  msg?: string;
}

export interface RegisterResponse {
  success: boolean;
  msg: string;
} 