// API Response types
export interface ApiResponse<T = unknown> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export interface ApiError {
  statusCode: number;
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

// Attendee types
export interface CreateAttendeeRequest {
  email: string;
  fullName: string;
  phoneNumber: string;
  jobTitle: string;
  company?: string;
}

export interface AttendeeData {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  company: string;
  jobTitle: string;
  role: 'ATTENDEE';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateAttendeeResponse = ApiResponse<AttendeeData>;

// Payment types
export interface InitiatePaymentRequest {
  attendeeId: string;
  email: string;
  amount: number;
}

export interface PaymentData {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export type InitiatePaymentResponse = ApiResponse<PaymentData>;

export interface adminLoginData {
  email: string;
  password: string;
}
export interface AdminData {
  admin: {
    id: string;
    fullName: string;
    email: string;
    role: string;
    isActive: boolean;
    invitedById: string | null;
    createdAt: string;
    updatedAt: string;
  };
  accessToken: string;
  refreshToken: string;
}

export type AdminLoginResponse = ApiResponse<AdminData>;
