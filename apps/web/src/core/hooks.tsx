import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { UserRole, Permission, AuthUser, AuthOrganization } from './auth';

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [organization, setOrganization] = useState<AuthOrganization | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Simulate loading auth state
  useEffect(() => {
    const timer = setTimeout(() => {
      // Mock user for development
      setUser({
        id: 'user_1',
        email: 'admin@sanctum.app',
        firstName: 'John',
        lastName: 'Admin',
        imageUrl: null,
        publicMetadata: {
          role: 'org_admin',
          permissions: [
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
          orgId: 'org_1',
          persona: 'church'
        },
        privateMetadata: {},
        unsafeMetadata: {},
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
      setOrganization({
        id: 'org_1',
        name: 'Grace Community Church',
        slug: 'grace-community',
        imageUrl: null,
        publicMetadata: {
          persona: 'church',
          settings: {}
        },
        privateMetadata: {},
        createdAt: Date.now(),
        updatedAt: Date.now(),
        membersCount: 150,
        pendingInvitationsCount: 0,
        role: 'org_admin',
        permissions: []
      });
      setIsLoaded(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const hasPermission = useCallback((permission: Permission) => {
    if (!user) return false;
    const perms = user.publicMetadata.permissions || [];
    return perms.includes(permission);
  }, [user]);

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
    setUser(null);
    setOrganization(null);
  }, []);

  const value = useMemo(() => ({
    user,
    organization,
    isLoaded,
    isSignedIn: !!user,
    userId: user?.id || null,
    orgId: organization?.id || null,
    orgRole: user?.publicMetadata?.role,
    orgSlug: organization?.slug || null,
    hasPermission,
    hasRole,
    isSuperAdmin,
    isOrgAdmin,
    getOrgPersona,
    signOut
  }), [user, organization, isLoaded, hasPermission, hasRole, isSuperAdmin, isOrgAdmin, getOrgPersona, signOut]);

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
  const required = permissionMap[resource]?.[action] as Permission[] || [];
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