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
  amount?: number;
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
  amount?: number;
}

export interface AdminAttendeeData extends AttendeeData {
  payment: {
    status: boolean;
    message: string;
    data: {
      authorization_url: string;
      access_code: string;
      reference: string;
    };
  };
  paymentUrl: string;
}

export type CreateAttendeeResponse = ApiResponse<AttendeeData>;
export type AdminCreateAttendeeResponse = ApiResponse<AdminAttendeeData>;

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

export interface Payment {
  id: string;
  attendeeId: string;
  amount: string;
  currency: string;
  paystackReference: string;
  paymentReference: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  paymentMethod:
    | 'card'
    | 'bank_transfer'
    | 'ussd'
    | 'qr'
    | 'mobile_money'
    | 'other';
  paidAt: string | null;
  failureReason: string | null;
  metadata: {
    access_code: string;
    webhookData: {
      id: number;
      log: any | null;
      fees: number;
      plan: Record<string, unknown>;
      split: Record<string, unknown>;
      amount: number;
      domain: string;
      paidAt: string;
      source: {
        type: string;
        source: string;
        identifier: string | null;
        entry_point: string;
      };
      status: string;
      channel: string;
      message: string | null;
      paid_at: string;
      currency: string;
      customer: {
        id: number;
        email: string;
        phone: string | null;
        metadata: any | null;
        last_name: string | null;
        first_name: string | null;
        risk_action: string;
        customer_code: string;
        international_format_phone: string | null;
      };
      metadata: {
        referrer: string;
        paymentId: string;
        attendeeId: string;
        attendeeName: string;
      };
      order_id: string | null;
      reference: string;
      created_at: string;
      fees_split: any | null;
      ip_address: string;
      subaccount: Record<string, unknown>;
      authorization: {
        bin: string;
        bank: string;
        brand: string;
        last4: string;
        channel: string;
        exp_year: string;
        reusable: boolean;
        card_type: string;
        exp_month: string;
        signature: string;
        account_name: string | null;
        country_code: string;
        receiver_bank: string | null;
        authorization_code: string;
        receiver_bank_account_number: string | null;
      };
      fees_breakdown: any | null;
      gateway_response: string;
      requested_amount: number;
      pos_transaction_data: any | null;
    };
  };
  createdAt: string;
  updatedAt: string;
  attendee: {
    id: string;
    fullName: string;
    email: string;
  };
  tickets: Tickets[];
}

type Tickets = {
  ticketNumber: string;
  isCheckedIn: boolean;
};

export type GetPaymentsResponse = ApiResponse<Payment[]>;

export interface GetPaymentsParams {
  page?: number;
  limit?: number;
}
