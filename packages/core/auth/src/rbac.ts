import { Permission, UserRole } from './client';

// ============================================
// Role Definitions
// ============================================

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  super_admin: [
    // All permissions
    'people:read', 'people:write', 'people:delete', 'people:import', 'people:export',
    'households:read', 'households:write', 'households:delete',
    'transactions:read', 'transactions:write', 'transactions:delete', 'transactions:reconcile', 'transactions:export',
    'funds:read', 'funds:write', 'funds:delete',
    'events:read', 'events:write', 'events:delete', 'events:checkin', 'events:register',
    'registrations:read', 'registrations:write', 'registrations:delete',
    'messages:read', 'messages:write', 'messages:send', 'messages:templates',
    'templates:read', 'templates:write', 'templates:delete',
    'workflows:read', 'workflows:write', 'workflows:delete', 'workflows:execute',
    'reports:read', 'reports:write', 'reports:delete', 'reports:schedule',
    'settings:read', 'settings:write',
    'integrations:read', 'integrations:write',
    'users:invite', 'users:remove', 'users:manage_roles'
  ],
  org_admin: [
    'people:read', 'people:write', 'people:delete', 'people:import', 'people:export',
    'households:read', 'households:write', 'households:delete',
    'transactions:read', 'transactions:write', 'transactions:delete', 'transactions:reconcile', 'transactions:export',
    'funds:read', 'funds:write', 'funds:delete',
    'events:read', 'events:write', 'events:delete', 'events:checkin', 'events:register',
    'registrations:read', 'registrations:write', 'registrations:delete',
    'messages:read', 'messages:write', 'messages:send', 'messages:templates',
    'templates:read', 'templates:write', 'templates:delete',
    'workflows:read', 'workflows:write', 'workflows:delete', 'workflows:execute',
    'reports:read', 'reports:write', 'reports:delete', 'reports:schedule',
    'settings:read', 'settings:write',
    'integrations:read', 'integrations:write',
    'users:invite', 'users:remove', 'users:manage_roles'
  ],
  org_manager: [
    'people:read', 'people:write', 'people:import', 'people:export',
    'households:read', 'households:write',
    'transactions:read', 'transactions:write', 'transactions:reconcile', 'transactions:export',
    'funds:read', 'funds:write',
    'events:read', 'events:write', 'events:checkin', 'events:register',
    'registrations:read', 'registrations:write',
    'messages:read', 'messages:write', 'messages:send', 'messages:templates',
    'templates:read', 'templates:write',
    'workflows:read', 'workflows:write', 'workflows:execute',
    'reports:read', 'reports:write', 'reports:schedule',
    'settings:read',
    'integrations:read',
    'users:invite'
  ],
  org_member: [
    'people:read', 'people:write',
    'households:read', 'households:write',
    'transactions:read', 'transactions:write',
    'funds:read',
    'events:read', 'events:register',
    'registrations:read', 'registrations:write',
    'messages:read', 'messages:write',
    'templates:read',
    'workflows:read', 'workflows:execute',
    'reports:read',
    'settings:read'
  ],
  org_viewer: [
    'people:read',
    'households:read',
    'transactions:read',
    'funds:read',
    'events:read',
    'registrations:read',
    'messages:read',
    'templates:read',
    'workflows:read',
    'reports:read',
    'settings:read'
  ],
  volunteer: [
    'people:read',
    'events:read', 'events:checkin',
    'registrations:read',
    'messages:read'
  ],
  staff: [
    'people:read', 'people:write',
    'households:read', 'households:write',
    'transactions:read', 'transactions:write',
    'funds:read',
    'events:read', 'events:write', 'events:checkin',
    'registrations:read', 'registrations:write',
    'messages:read', 'messages:write', 'messages:send',
    'templates:read',
    'workflows:read', 'workflows:execute',
    'reports:read'
  ],
  teacher: [
    'people:read', 'people:write',
    'households:read',
    'transactions:read',
    'events:read', 'events:register',
    'registrations:read', 'registrations:write',
    'messages:read', 'messages:write', 'messages:send',
    'templates:read',
    'workflows:read',
    'reports:read'
  ],
  parent: [
    'people:read',
    'households:read',
    'transactions:read',
    'events:read', 'events:register',
    'registrations:read',
    'messages:read'
  ],
  student: [
    'people:read',
    'events:read', 'events:register',
    'registrations:read',
    'messages:read'
  ]
};

// ============================================
// Persona-specific Role Mappings
// ============================================

export const PERSONA_ROLES: Record<string, UserRole[]> = {
  church: ['org_admin', 'org_manager', 'org_member', 'org_viewer', 'volunteer', 'staff'],
  school: ['org_admin', 'org_manager', 'org_member', 'org_viewer', 'teacher', 'parent', 'student'],
  ngo: ['org_admin', 'org_manager', 'org_member', 'org_viewer', 'volunteer', 'staff'],
  sme: ['org_admin', 'org_manager', 'org_member', 'org_viewer', 'staff']
};

export const PERSONA_DEFAULT_ROLE: Record<string, UserRole> = {
  church: 'org_member',
  school: 'org_member',
  ngo: 'org_member',
  sme: 'org_member'
};

// ============================================
// Permission Helpers
// ============================================

export function getPermissionsForRole(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

export function getRolesForPersona(persona: string): UserRole[] {
  return PERSONA_ROLES[persona] || PERSONA_ROLES.church;
}

export function getDefaultRoleForPersona(persona: string): UserRole {
  return PERSONA_DEFAULT_ROLE[persona] || 'org_member';
}

export function roleHasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function getHighestRole(roles: UserRole[]): UserRole {
  const hierarchy: UserRole[] = [
    'super_admin',
    'org_admin',
    'org_manager',
    'org_member',
    'staff',
    'teacher',
    'volunteer',
    'org_viewer',
    'parent',
    'student'
  ];
  for (const role of hierarchy) {
    if (roles.includes(role)) return role;
  }
  return 'org_viewer';
}

export function canManageRole(managerRole: UserRole, targetRole: UserRole): boolean {
  const hierarchy: UserRole[] = [
    'super_admin',
    'org_admin',
    'org_manager',
    'org_member',
    'staff',
    'teacher',
    'volunteer',
    'org_viewer',
    'parent',
    'student'
  ];
  const managerIndex = hierarchy.indexOf(managerRole);
  const targetIndex = hierarchy.indexOf(targetRole);
  return managerIndex >= 0 && targetIndex >= 0 && managerIndex < targetIndex;
}

// ============================================
// Resource-based Permissions
// ============================================

export interface ResourcePermission {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
  conditions?: Record<string, any>;
}

export function checkResourcePermission(
  permissions: Permission[],
  resource: string,
  action: 'create' | 'read' | 'update' | 'delete' | 'manage'
): boolean {
  const permissionMap: Record<string, Record<string, Permission[]>> = {
    people: {
      create: ['people:write'],
      read: ['people:read'],
      update: ['people:write'],
      delete: ['people:delete'],
      manage: ['people:write', 'people:delete', 'people:import', 'people:export']
    },
    households: {
      create: ['households:write'],
      read: ['households:read'],
      update: ['households:write'],
      delete: ['households:delete'],
      manage: ['households:write', 'households:delete']
    },
    transactions: {
      create: ['transactions:write'],
      read: ['transactions:read'],
      update: ['transactions:write'],
      delete: ['transactions:delete'],
      manage: ['transactions:write', 'transactions:delete', 'transactions:reconcile', 'transactions:export']
    },
    funds: {
      create: ['funds:write'],
      read: ['funds:read'],
      update: ['funds:write'],
      delete: ['funds:delete'],
      manage: ['funds:write', 'funds:delete']
    },
    events: {
      create: ['events:write'],
      read: ['events:read'],
      update: ['events:write'],
      delete: ['events:delete'],
      manage: ['events:write', 'events:delete', 'events:checkin', 'events:register']
    },
    registrations: {
      create: ['registrations:write'],
      read: ['registrations:read'],
      update: ['registrations:write'],
      delete: ['registrations:delete'],
      manage: ['registrations:write', 'registrations:delete']
    },
    messages: {
      create: ['messages:write'],
      read: ['messages:read'],
      update: ['messages:write'],
      delete: ['messages:write'],
      manage: ['messages:write', 'messages:send', 'messages:templates']
    },
    templates: {
      create: ['templates:write'],
      read: ['templates:read'],
      update: ['templates:write'],
      delete: ['templates:delete'],
      manage: ['templates:write', 'templates:delete']
    },
    workflows: {
      create: ['workflows:write'],
      read: ['workflows:read'],
      update: ['workflows:write'],
      delete: ['workflows:delete'],
      manage: ['workflows:write', 'workflows:delete', 'workflows:execute']
    },
    reports: {
      create: ['reports:write'],
      read: ['reports:read'],
      update: ['reports:write'],
      delete: ['reports:delete'],
      manage: ['reports:write', 'reports:delete', 'reports:schedule']
    },
    settings: {
      create: ['settings:write'],
      read: ['settings:read'],
      update: ['settings:write'],
      delete: ['settings:write'],
      manage: ['settings:write']
    },
    integrations: {
      create: ['integrations:write'],
      read: ['integrations:read'],
      update: ['integrations:write'],
      delete: ['integrations:write'],
      manage: ['integrations:write']
    },
    users: {
      create: ['users:invite'],
      read: ['people:read'],
      update: ['users:manage_roles'],
      delete: ['users:remove'],
      manage: ['users:invite', 'users:remove', 'users:manage_roles']
    }
  };

  const required = permissionMap[resource]?.[action] || [];
  return required.some(p => permissions.includes(p));
}

// ============================================
// Permission Matrix for UI
// ============================================

export const PERMISSION_GROUPS = {
  'People & Households': [
    'people:read', 'people:write', 'people:delete', 'people:import', 'people:export',
    'households:read', 'households:write', 'households:delete'
  ],
  'Finance': [
    'transactions:read', 'transactions:write', 'transactions:delete', 'transactions:reconcile', 'transactions:export',
    'funds:read', 'funds:write', 'funds:delete'
  ],
  'Events & Registrations': [
    'events:read', 'events:write', 'events:delete', 'events:checkin', 'events:register',
    'registrations:read', 'registrations:write', 'registrations:delete'
  ],
  'Communications': [
    'messages:read', 'messages:write', 'messages:send', 'messages:templates',
    'templates:read', 'templates:write', 'templates:delete'
  ],
  'Automation': [
    'workflows:read', 'workflows:write', 'workflows:delete', 'workflows:execute'
  ],
  'Reporting': [
    'reports:read', 'reports:write', 'reports:delete', 'reports:schedule'
  ],
  'Administration': [
    'settings:read', 'settings:write',
    'integrations:read', 'integrations:write',
    'users:invite', 'users:remove', 'users:manage_roles'
  ]
} as const;

export function getPermissionDescription(permission: Permission): string {
  const descriptions: Record<Permission, string> = {
    'people:read': 'View people and members',
    'people:write': 'Create and edit people',
    'people:delete': 'Delete people',
    'people:import': 'Import people from CSV/other systems',
    'people:export': 'Export people data',
    'households:read': 'View households/families',
    'households:write': 'Create and edit households',
    'households:delete': 'Delete households',
    'transactions:read': 'View transactions/giving',
    'transactions:write': 'Create and edit transactions',
    'transactions:delete': 'Delete transactions',
    'transactions:reconcile': 'Reconcile transactions',
    'transactions:export': 'Export transaction data',
    'funds:read': 'View funds/accounts',
    'funds:write': 'Create and edit funds',
    'funds:delete': 'Delete funds',
    'events:read': 'View events',
    'events:write': 'Create and edit events',
    'events:delete': 'Delete events',
    'events:checkin': 'Manage check-in',
    'events:register': 'Register for events',
    'registrations:read': 'View registrations',
    'registrations:write': 'Manage registrations',
    'registrations:delete': 'Delete registrations',
    'messages:read': 'View messages',
    'messages:write': 'Create and edit messages',
    'messages:send': 'Send messages',
    'messages:templates': 'Manage message templates',
    'templates:read': 'View templates',
    'templates:write': 'Create and edit templates',
    'templates:delete': 'Delete templates',
    'workflows:read': 'View workflows',
    'workflows:write': 'Create and edit workflows',
    'workflows:delete': 'Delete workflows',
    'workflows:execute': 'Execute workflows',
    'reports:read': 'View reports',
    'reports:write': 'Create and edit reports',
    'reports:delete': 'Delete reports',
    'reports:schedule': 'Schedule report delivery',
    'settings:read': 'View settings',
    'settings:write': 'Modify settings',
    'integrations:read': 'View integrations',
    'integrations:write': 'Configure integrations',
    'users:invite': 'Invite users',
    'users:remove': 'Remove users',
    'users:manage_roles': 'Manage user roles and permissions'
  };
  return descriptions[permission] || permission;
}