export const queryKeys = {
  // Auth
  me: () => ['admin', 'me'] as const,

  // Admins
  admins: {
    all: (params?: Record<string, unknown>) =>
      params ? (['admins', params] as const) : (['admins'] as const),
    detail: (id: string) => ['admins', id] as const,
  },

  // Roles
  roles: {
    all: () => ['roles'] as const,
    detail: (id: string) => ['roles', id] as const,
    permissions: () => ['roles', 'permissions'] as const,
  },

  // Tickets
  tickets: {
    all: (params?: Record<string, unknown>) => ['tickets', params] as const,
    detail: (id: string) => ['tickets', id] as const,
    onSale: (params?: Record<string, unknown>) => ['tickets', 'onsale', params] as const,
  },

  // Orders (replaces the old attendees list — attendees API now only handles check-in)
  orders: {
    all: (params?: Record<string, unknown>) =>
      params ? (['orders', params] as const) : (['orders'] as const),
    reference: (reference: string) => ['orders', 'reference', reference] as const,
     detail: (id: string) => ['orders', id] as const,
    /** Scan-accumulated, client-side check-in-filtered view of /orders (see order.service.ts). */
    checkInFiltered: (params: Record<string, unknown>) =>
      ['orders', 'checkin-filtered', params] as const,
  },

  // Attendees (check-in + the checked-in attendees list, both under /attendees)
  attendees: {
    checkedIn: (params: Record<string, unknown>) => ['attendees', 'checked-in', params] as const,
  },
} as const;
