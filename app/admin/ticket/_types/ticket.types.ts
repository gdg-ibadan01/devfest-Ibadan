export type DeclarationDate = 'friday' | 'saturday' | 'both';

export interface TicketBasicInfo {
  name: string;
  description: string;
  declarationDate: DeclarationDate;
  /** Actual ISO date strings for each selected event day — maps to API eventDates[] */
  fridayDate: string;
  saturdayDate: string;
}

export interface TicketPricing {
  price: string;
  discount: string;
  earlyBird: boolean;
}

export interface TicketAdvancedSettings {
  validity: DeclarationDate;
  /** Actual ISO date strings for validity — maps to API validityDates[] */
  fridayValidityDate: string;
  saturdayValidityDate: string;
  quantityLimit: string;
  capacity: string;
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

/** Derive eventDates[] array from form basicInfo */
export function buildEventDates(info: TicketBasicInfo): string[] {
  if (info.declarationDate === 'friday') return [info.fridayDate].filter(Boolean);
  if (info.declarationDate === 'saturday') return [info.saturdayDate].filter(Boolean);
  return [info.fridayDate, info.saturdayDate].filter(Boolean);
}

/** Derive validityDates[] array from advancedSettings */
export function buildValidityDates(settings: TicketAdvancedSettings): string[] {
  if (settings.validity === 'friday') return [settings.fridayValidityDate].filter(Boolean);
  if (settings.validity === 'saturday') return [settings.saturdayValidityDate].filter(Boolean);
  return [settings.fridayValidityDate, settings.saturdayValidityDate].filter(Boolean);
}

