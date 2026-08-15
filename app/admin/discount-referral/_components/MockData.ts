import type { DiscountRecord } from "../_types/discount.types";

const MOCK_DISCOUNTS: DiscountRecord[] = [
  {
    id: '1',
    discountId: 'DevFest1029',
    type: 'percentage',
    value: '10%',
    usage: '34/1000',
    validity: '15th Mar - 23rd Oct',
    status: 'Active',
  },
  {
    id: '2',
    discountId: 'DevFest1029',
    type: 'fixed',
    value: '₦1000',
    usage: '0/12',
    validity: '15th Mar - 23rd Oct',
    status: 'Active',
  },
  {
    id: '3',
    discountId: 'DevFest1029',
    type: 'percentage',
    value: '10%',
    usage: '33/4000',
    validity: '15th Mar - 23rd Oct',
    status: 'Expired',
  },
  {
    id: '4',
    discountId: 'DevFest1029',
    type: 'percentage',
    value: '10%',
    usage: '1000/1000',
    validity: '15th Mar - 23rd Oct',
    status: 'Scheduled',
  },
  {
    id: '5',
    discountId: 'DevFest1029',
    type: 'percentage',
    value: '₦1000',
    usage: '12/1000',
    validity: '15th Mar - 23rd Oct',
    status: 'Active',
  },
];

export default MOCK_DISCOUNTS;