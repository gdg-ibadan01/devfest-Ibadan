export type DeclarationDate = 'friday' | 'saturday' | 'both';

export interface TicketBasicInfo {
  name: string;
  description: string;
  declarationDate: DeclarationDate;
}

export interface TicketPricing {
  price: string;
  discount: string;
  earlyBird: boolean;
}

export interface TicketAdvancedSettings {
  validity: DeclarationDate;
  quantityLimit: string;
  startDate: string;
  endDate: string;
}

export interface TicketFormData {
  basicInfo: TicketBasicInfo;
  pricing: TicketPricing;
  advancedSettings: TicketAdvancedSettings;
}

export type CreateTicketStep = 'basicInfo' | 'pricing' | 'advancedSettings';

export interface TicketRecord {
  id: string;
  name: string;
  declarationDates: { label: string; day: 'fri' | 'sat' }[];
  price: string;
  discount: string;
  startDate: string;
  endDate: string;
  quantity: number;
}
