import { createContext, useContext, useCallback, useMemo, ReactNode } from 'react';
import { useAuth, useUser, useOrganization } from '@clerk/clerk-react';
import { UserRole, Permission, AuthUser, AuthOrganization, getPermissionsForRole } from './auth';

interface AuthContextType {
  user: AuthUser | null;
  organization: AuthOrganization | null;
  isLoaded: boolean;
  isSignedIn: boolean;
  userId: string | null;
  orgId: string | null;
  orgRole: UserRole | undefined;
  orgSlug: string | null;
  hasPermission: (permission: Permission) => boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  isSuperAdmin: () => boolean;
  isOrgAdmin: () => boolean;
  getOrgPersona: () => 'church' | 'school' | 'ngo' | 'sme' | null;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function mapClerkUser(clerkUser: any): AuthUser | null {
  if (!clerkUser) return null;
  return {
    id: clerkUser.id,
    email: clerkUser.emailAddresses?.[0]?.emailAddress || '',
    firstName: clerkUser.firstName,
    lastName: clerkUser.lastName,
    imageUrl: clerkUser.imageUrl,
    publicMetadata: {
      role: clerkUser.publicMetadata?.role as UserRole | undefined,
      permissions: (clerkUser.publicMetadata?.permissions as Permission[]) || [],
      orgId: clerkUser.publicMetadata?.orgId as string | undefined,
      persona: clerkUser.publicMetadata?.persona as 'church' | 'school' | 'ngo' | 'sme' | undefined,
    },
    privateMetadata: clerkUser.privateMetadata || {},
    unsafeMetadata: clerkUser.unsafeMetadata || {},
    createdAt: clerkUser.createdAt,
    updatedAt: clerkUser.updatedAt,
  };
}

function mapClerkOrganization(clerkOrg: any): AuthOrganization | null {
  if (!clerkOrg) return null;
  return {
    id: clerkOrg.id,
    name: clerkOrg.name,
    slug: clerkOrg.slug || '',
    imageUrl: clerkOrg.imageUrl,
    publicMetadata: {
      persona: clerkOrg.publicMetadata?.persona as 'church' | 'school' | 'ngo' | 'sme' | undefined,
      settings: clerkOrg.publicMetadata?.settings as Record<string, any> | undefined,
    },
    privateMetadata: clerkOrg.privateMetadata || {},
    createdAt: clerkOrg.createdAt,
    updatedAt: clerkOrg.updatedAt,
    membersCount: clerkOrg.membersCount || 0,
    pendingInvitationsCount: clerkOrg.pendingInvitationsCount || 0,
    role: (clerkOrg.membership?.role as UserRole) || 'org_member',
    permissions: (clerkOrg.publicMetadata?.permissions as Permission[]) || [],
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn, userId, orgId, orgRole, signOut: clerkSignOut } = useAuth();
  const { user: clerkUser } = useUser();
  const { organization: clerkOrg } = useOrganization();

  const user = useMemo(() => mapClerkUser(clerkUser), [clerkUser]);
  const organization = useMemo(() => mapClerkOrganization(clerkOrg), [clerkOrg]);

  const hasPermission = useCallback((permission: Permission) => {
    if (!user) return false;
    const perms = user.publicMetadata.permissions || [];
    if (perms.includes(permission)) return true;

    // Also check role-based permissions
    const role = user.publicMetadata.role;
    if (role) {
      const rolePerms = getPermissionsForRole(role);
      if (rolePerms.includes(permission)) return true;
    }

    // Check organization-level permissions
    if (organization) {
      const orgPerms = organization.permissions || [];
      if (orgPerms.includes(permission)) return true;
    }

    return false;
  }, [user, organization]);

  const hasRole = useCallback((role: UserRole | UserRole[]) => {
    if (!user) return false;
    const userRole = user.publicMetadata.role;
    const roles = Array.isArray(role) ? role : [role];
    return userRole ? roles.includes(userRole) : false;
  }, [user]);

  const isSuperAdmin = useCallback(() => hasRole('super_admin'), [hasRole]);
  const isOrgAdmin = useCallback(() => hasRole(['org_admin', 'super_admin']), [hasRole]);

  const getOrgPersona = useCallback((): 'church' | 'school' | 'ngo' | 'sme' | null => {
    return organization?.publicMetadata?.persona || user?.publicMetadata?.persona || null;
  }, [organization, user]);

  const signOut = useCallback(() => {
    clerkSignOut();
  }, [clerkSignOut]);

  const value = useMemo(() => ({
    user,
    organization,
    isLoaded,
    isSignedIn: !!isSignedIn,
    userId: userId || null,
    orgId: orgId || null,
    orgRole: orgRole as UserRole | undefined,
    orgSlug: organization?.slug || null,
    hasPermission,
    hasRole,
    isSuperAdmin,
    isOrgAdmin,
    getOrgPersona,
    signOut
  }), [user, organization, isLoaded, isSignedIn, userId, orgId, orgRole, hasPermission, hasRole, isSuperAdmin, isOrgAdmin, getOrgPersona, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function usePlatformAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('usePlatformAuth must be used within an AuthProvider');
  }
  return context;
}

export function ProtectedRoute({ 
  children, 
  fallback = null, 
  requiredPermission, 
  requiredRole 
}: { 
  children: ReactNode; 
  fallback?: ReactNode; 
  requiredPermission?: Permission; 
  requiredRole?: UserRole | UserRole[]; 
}) {
  const { isLoaded, isSignedIn, hasPermission, hasRole } = usePlatformAuth();

  if (!isLoaded) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!isSignedIn) return fallback;

  if (requiredPermission && !hasPermission(requiredPermission)) return fallback;
  if (requiredRole && !hasRole(requiredRole)) return fallback;

  return <>{children}</>;
}

function checkResourcePermission(permissions: Permission[], resource: string, action: string): boolean {
  const permissionMap: Record<string, Record<string, Permission[]>> = {
    people: { create: ['people:write'], read: ['people:read'], update: ['people:write'], delete: ['people:delete'], manage: ['people:write', 'people:delete', 'people:import', 'people:export'] },
    households: { create: ['households:write'], read: ['households:read'], update: ['households:write'], delete: ['households:delete'], manage: ['households:write', 'households:delete'] },
    transactions: { create: ['transactions:write'], read: ['transactions:read'], update: ['transactions:write'], delete: ['transactions:delete'], manage: ['transactions:write', 'transactions:delete', 'transactions:reconcile', 'transactions:export'] },
    funds: { create: ['funds:write'], read: ['funds:read'], update: ['funds:write'], delete: ['funds:delete'], manage: ['funds:write', 'funds:delete'] },
    events: { create: ['events:write'], read: ['events:read'], update: ['events:write'], delete: ['events:delete'], manage: ['events:write', 'events:delete', 'events:checkin', 'events:register'] },
    registrations: { create: ['registrations:write'], read: ['registrations:read'], update: ['registrations:write'], delete: ['registrations:delete'], manage: ['registrations:write', 'registrations:delete'] },
    messages: { create: ['messages:write'], read: ['messages:read'], update: ['messages:write'], delete: ['messages:write'], manage: ['messages:write', 'messages:send', 'messages:templates'] },
    templates: { create: ['templates:write'], read: ['templates:read'], update: ['templates:write'], delete: ['templates:delete'], manage: ['templates:write', 'templates:delete'] },
    workflows: { create: ['workflows:write'], read: ['workflows:read'], update: ['workflows:write'], delete: ['workflows:delete'], manage: ['workflows:write', 'workflows:delete', 'workflows:execute'] },
    reports: { create: ['reports:write'], read: ['reports:read'], update: ['reports:write'], delete: ['reports:delete'], manage: ['reports:write', 'reports:delete', 'reports:schedule'] },
    settings: { create: ['settings:write'], read: ['settings:read'], update: ['settings:write'], delete: ['settings:write'], manage: ['settings:write'] },
    integrations: { create: ['integrations:write'], read: ['integrations:read'], update: ['integrations:write'], delete: ['integrations:write'], manage: ['integrations:write'] },
    users: { create: ['users:invite'], read: ['people:read'], update: ['users:manage_roles'], delete: ['users:remove'], manage: ['users:invite', 'users:remove', 'users:manage_roles'] }
  };
  const required = (permissionMap[resource]?.[action] || []) as Permission[];
  return required.some((p: Permission) => permissions.includes(p));
}

export function usePermissions() {
  const { hasPermission, hasRole, isSuperAdmin, isOrgAdmin, user, organization } = usePlatformAuth();
  const can = useCallback((permission: Permission) => hasPermission(permission), [hasPermission]);
  const canAll = useCallback((permissions: Permission[]) => permissions.every(p => hasPermission(p)), [hasPermission]);
  const canAny = useCallback((permissions: Permission[]) => permissions.some(p => hasPermission(p)), [hasPermission]);
  const hasResourceAccess = useCallback((resource: string, action: string) => {
    if (!user) return false;
    const permissions = (user.publicMetadata?.permissions as Permission[]) || [];
    return checkResourcePermission(permissions, resource, action);
  }, [user]);
  return useMemo(() => ({ can, canAll, canAny, hasResourceAccess, hasRole, isSuperAdmin, isOrgAdmin, userPermissions: (user?.publicMetadata?.permissions as Permission[]) || [], orgPermissions: [] }), [can, canAll, canAny, hasResourceAccess, hasRole, isSuperAdmin, isOrgAdmin, user, organization]);
}

function createResourceHook(resource: string) {
  return () => {
    const { hasResourceAccess } = usePermissions();
    return { canRead: hasResourceAccess(resource, 'read'), canCreate: hasResourceAccess(resource, 'create'), canUpdate: hasResourceAccess(resource, 'update'), canDelete: hasResourceAccess(resource, 'delete'), canManage: hasResourceAccess(resource, 'manage') };
  };
}

export const usePeoplePermissions = createResourceHook('people');
export const useHouseholdPermissions = createResourceHook('households');
export const useTransactionPermissions = createResourceHook('transactions');
export const useFundPermissions = createResourceHook('funds');
export const useEventPermissions = createResourceHook('events');
export const useRegistrationPermissions = createResourceHook('registrations');
export const useMessagePermissions = createResourceHook('messages');
export const useTemplatePermissions = createResourceHook('templates');
export const useWorkflowPermissions = createResourceHook('workflows');
export const useReportPermissions = createResourceHook('reports');
export const useSettingsPermissions = createResourceHook('settings');
export const useIntegrationPermissions = createResourceHook('integrations');
export const useUserManagementPermissions = createResourceHook('users');
