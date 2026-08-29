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
  },

  // Attendees
  attendees: {
    all: (params?: Record<string, unknown>) => ['attendees', params] as const,
    detail: (id: string) => ['attendees', id] as const,
  },
} as const;
