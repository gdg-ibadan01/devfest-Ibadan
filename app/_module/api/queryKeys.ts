export const queryKeys = {
  // Auth
  me: () => ['admin', 'me'] as const,

  // Admins
  admins: {
    all: (params?: Record<string, unknown>) => ['admins', params] as const,
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
    onSale: (name?: string) => ['tickets', 'onsale', name] as const,
  },

  // Attendees
  attendees: {
    all: (params?: Record<string, unknown>) => ['attendees', params] as const,
    detail: (id: string) => ['attendees', id] as const,
  },

  // Orders
  orders: {
    all: (params?: Record<string, unknown>) => ['orders', params] as const,
    detail: (id: string) => ['orders', id] as const,
  },

  // Audit Logs
  auditLogs: {
    all: (params?: Record<string, unknown>) => ['auditLogs', params] as const,
    detail: (id: string) => ['auditLogs', id] as const,
  },
} as const;
