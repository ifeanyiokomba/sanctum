import { z } from 'zod';

export const UserRole = z.enum([
  'super_admin', 'org_admin', 'org_manager', 'org_member', 'org_viewer',
  'volunteer', 'staff', 'teacher', 'parent', 'student'
]);
export type UserRole = z.infer<typeof UserRole>;

export const Permission = z.enum([
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
]);
export type Permission = z.infer<typeof Permission>;

export interface AuthUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  publicMetadata: {
    role?: UserRole;
    permissions?: Permission[];
    orgId?: string;
    persona?: 'church' | 'school' | 'ngo' | 'sme';
  };
  privateMetadata: Record<string, any>;
  unsafeMetadata: Record<string, any>;
  createdAt: number;
  updatedAt: number;
}

export interface AuthOrganization {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  publicMetadata: {
    persona?: 'church' | 'school' | 'ngo' | 'sme';
    settings?: Record<string, any>;
  };
  privateMetadata: Record<string, any>;
  createdAt: number;
  updatedAt: number;
  membersCount: number;
  pendingInvitationsCount: number;
  role: UserRole;
  permissions: Permission[];
}

export interface SessionClaims {
  sub: string;
  email: string;
  org_id?: string;
  org_role?: UserRole;
  org_permissions?: Permission[];
  org_persona?: 'church' | 'school' | 'ngo' | 'sme';
  org_slug?: string;
}

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  super_admin: ['people:read', 'people:write', 'people:delete', 'people:import', 'people:export', 'households:read', 'households:write', 'households:delete', 'transactions:read', 'transactions:write', 'transactions:delete', 'transactions:reconcile', 'transactions:export', 'funds:read', 'funds:write', 'funds:delete', 'events:read', 'events:write', 'events:delete', 'events:checkin', 'events:register', 'registrations:read', 'registrations:write', 'registrations:delete', 'messages:read', 'messages:write', 'messages:send', 'messages:templates', 'templates:read', 'templates:write', 'templates:delete', 'workflows:read', 'workflows:write', 'workflows:delete', 'workflows:execute', 'reports:read', 'reports:write', 'reports:delete', 'reports:schedule', 'settings:read', 'settings:write', 'integrations:read', 'integrations:write', 'users:invite', 'users:remove', 'users:manage_roles'],
  org_admin: ['people:read', 'people:write', 'people:delete', 'people:import', 'people:export', 'households:read', 'households:write', 'households:delete', 'transactions:read', 'transactions:write', 'transactions:delete', 'transactions:reconcile', 'transactions:export', 'funds:read', 'funds:write', 'funds:delete', 'events:read', 'events:write', 'events:delete', 'events:checkin', 'events:register', 'registrations:read', 'registrations:write', 'registrations:delete', 'messages:read', 'messages:write', 'messages:send', 'messages:templates', 'templates:read', 'templates:write', 'templates:delete', 'workflows:read', 'workflows:write', 'workflows:delete', 'workflows:execute', 'reports:read', 'reports:write', 'reports:delete', 'reports:schedule', 'settings:read', 'settings:write', 'integrations:read', 'integrations:write', 'users:invite', 'users:remove', 'users:manage_roles'],
  org_manager: ['people:read', 'people:write', 'people:import', 'people:export', 'households:read', 'households:write', 'transactions:read', 'transactions:write', 'transactions:reconcile', 'transactions:export', 'funds:read', 'funds:write', 'events:read', 'events:write', 'events:checkin', 'events:register', 'registrations:read', 'registrations:write', 'messages:read', 'messages:write', 'messages:send', 'messages:templates', 'templates:read', 'templates:write', 'workflows:read', 'workflows:write', 'workflows:execute', 'reports:read', 'reports:write', 'reports:schedule', 'settings:read', 'integrations:read', 'users:invite'],
  org_member: ['people:read', 'people:write', 'households:read', 'households:write', 'transactions:read', 'transactions:write', 'funds:read', 'events:read', 'events:register', 'registrations:read', 'registrations:write', 'messages:read', 'messages:write', 'templates:read', 'workflows:read', 'workflows:execute', 'reports:read', 'settings:read'],
  org_viewer: ['people:read', 'households:read', 'transactions:read', 'funds:read', 'events:read', 'registrations:read', 'messages:read', 'templates:read', 'workflows:read', 'reports:read', 'settings:read'],
  volunteer: ['people:read', 'events:read', 'events:checkin', 'registrations:read', 'messages:read'],
  staff: ['people:read', 'people:write', 'households:read', 'households:write', 'transactions:read', 'transactions:write', 'funds:read', 'events:read', 'events:write', 'events:checkin', 'registrations:read', 'registrations:write', 'messages:read', 'messages:write', 'messages:send', 'templates:read', 'workflows:read', 'workflows:execute', 'reports:read'],
  teacher: ['people:read', 'people:write', 'households:read', 'transactions:read', 'events:read', 'events:register', 'registrations:read', 'registrations:write', 'messages:read', 'messages:write', 'messages:send', 'templates:read', 'workflows:read', 'reports:read'],
  parent: ['people:read', 'households:read', 'transactions:read', 'events:read', 'events:register', 'registrations:read', 'messages:read'],
  student: ['people:read', 'events:read', 'events:register', 'registrations:read', 'messages:read']
};

export function getPermissionsForRole(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

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

export function hasRoleInOrg(membership: { role: UserRole; permissions: Permission[] } | null, role: UserRole | UserRole[]): boolean {
  if (!membership) return false;
  const roles = Array.isArray(role) ? role : [role];
  return roles.includes(membership.role);
}