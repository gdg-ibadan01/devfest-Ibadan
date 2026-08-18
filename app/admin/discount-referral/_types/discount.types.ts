export type DiscountType = 'percentage' | 'fixed';
export type AppliesTo = 'all' | 'selected';
export type UsageLimitType = 'unlimited' | 'limited';
export type DiscountStatus = 'Active' | 'Expired' | 'Scheduled';

export interface DiscountRecord {
  id: string;
  discountId: string;
  type: DiscountType;
  value: string;
  usage: string;
  validity: string;
  status: DiscountStatus;
}

export interface CreateDiscountForm {
  name: string;
  code: string;
  discountType: DiscountType;
  value: string;
  appliesTo: AppliesTo;
  declarationDates: string[];
  usageLimit: UsageLimitType;
  users: string;
  startDate: string;
  endDate: string;
  firstTimeOnly: boolean;
}
