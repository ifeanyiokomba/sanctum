import { useCallback, useMemo } from 'react';
import { usePlatformAuth } from './client';
import { Permission, UserRole } from './client';
import { checkResourcePermission, getPermissionDescription } from './rbac';
import { ReactNode } from 'react';

// ============================================
// Permission Hooks
// ============================================

export function usePermissions() {
  const { hasPermission, hasRole, isSuperAdmin, isOrgAdmin, user, organization } = usePlatformAuth();

  const can = useCallback(
    (permission: Permission) => hasPermission(permission),
    [hasPermission]
  );

  const canAll = useCallback(
    (permissions: Permission[]) => permissions.every(p => hasPermission(p)),
    [hasPermission]
  );

  const canAny = useCallback(
    (permissions: Permission[]) => permissions.some(p => hasPermission(p)),
    [hasPermission]
  );

  const hasResourceAccess = useCallback(
    (resource: string, action: 'create' | 'read' | 'update' | 'delete' | 'manage') => {
      if (!user) return false;
      const permissions = (user.publicMetadata?.permissions as Permission[]) || 
                          ((organization?.publicMetadata as Record<string, unknown>)?.permissions as Permission[]) || 
                          [];
      return checkResourcePermission(permissions, resource, action);
    },
    [user, organization]
  );

  return useMemo(
    () => ({
      can,
      canAll,
      canAny,
      hasResourceAccess,
      hasRole,
      isSuperAdmin,
      isOrgAdmin,
      userPermissions: (user?.publicMetadata?.permissions as Permission[]) || [],
      orgPermissions: ((organization?.publicMetadata as Record<string, unknown>)?.permissions as Permission[]) || []
    }),
    [can, canAll, canAny, hasResourceAccess, hasRole, isSuperAdmin, isOrgAdmin, user, organization]
  );
}

export function useRole() {
  const { user, organization, hasRole } = usePlatformAuth();

  const currentRole = useMemo(() => {
    return ((organization?.publicMetadata as Record<string, unknown>)?.role as UserRole) || 
           (user?.publicMetadata?.role as UserRole) || 
           'org_member';
  }, [user, organization]);

  return useMemo(
    () => ({
      currentRole,
      hasRole,
      isAdmin: hasRole(['org_admin', 'super_admin']),
      isManager: hasRole(['org_manager', 'org_admin', 'super_admin']),
      isMember: hasRole(['org_member', 'org_manager', 'org_admin', 'super_admin']),
      isViewer: hasRole(['org_viewer'])
    }),
    [currentRole, hasRole]
  );
}

// ============================================
// Resource-specific Hooks
// ============================================

export function usePeoplePermissions() {
  const { hasResourceAccess } = usePermissions();
  return {
    canRead: hasResourceAccess('people', 'read'),
    canCreate: hasResourceAccess('people', 'create'),
    canUpdate: hasResourceAccess('people', 'update'),
    canDelete: hasResourceAccess('people', 'delete'),
    canImport: hasResourceAccess('people', 'manage'),
    canExport: hasResourceAccess('people', 'manage')
  };
}

export function useHouseholdPermissions() {
  const { hasResourceAccess } = usePermissions();
  return {
    canRead: hasResourceAccess('households', 'read'),
    canCreate: hasResourceAccess('households', 'create'),
    canUpdate: hasResourceAccess('households', 'update'),
    canDelete: hasResourceAccess('households', 'delete')
  };
}

export function useTransactionPermissions() {
  const { hasResourceAccess } = usePermissions();
  return {
    canRead: hasResourceAccess('transactions', 'read'),
    canCreate: hasResourceAccess('transactions', 'create'),
    canUpdate: hasResourceAccess('transactions', 'update'),
    canDelete: hasResourceAccess('transactions', 'delete'),
    canReconcile: hasResourceAccess('transactions', 'manage'),
    canExport: hasResourceAccess('transactions', 'manage')
  };
}

export function useFundPermissions() {
  const { hasResourceAccess } = usePermissions();
  return {
    canRead: hasResourceAccess('funds', 'read'),
    canCreate: hasResourceAccess('funds', 'create'),
    canUpdate: hasResourceAccess('funds', 'update'),
    canDelete: hasResourceAccess('funds', 'delete')
  };
}

export function useEventPermissions() {
  const { hasResourceAccess } = usePermissions();
  return {
    canRead: hasResourceAccess('events', 'read'),
    canCreate: hasResourceAccess('events', 'create'),
    canUpdate: hasResourceAccess('events', 'update'),
    canDelete: hasResourceAccess('events', 'delete'),
    canCheckin: hasResourceAccess('events', 'manage'),
    canRegister: hasResourceAccess('events', 'manage')
  };
}

export function useRegistrationPermissions() {
  const { hasResourceAccess } = usePermissions();
  return {
    canRead: hasResourceAccess('registrations', 'read'),
    canCreate: hasResourceAccess('registrations', 'create'),
    canUpdate: hasResourceAccess('registrations', 'update'),
    canDelete: hasResourceAccess('registrations', 'delete')
  };
}

export function useMessagePermissions() {
  const { hasResourceAccess } = usePermissions();
  return {
    canRead: hasResourceAccess('messages', 'read'),
    canCreate: hasResourceAccess('messages', 'create'),
    canSend: hasResourceAccess('messages', 'manage'),
    canManageTemplates: hasResourceAccess('messages', 'manage')
  };
}

export function useTemplatePermissions() {
  const { hasResourceAccess } = usePermissions();
  return {
    canRead: hasResourceAccess('templates', 'read'),
    canCreate: hasResourceAccess('templates', 'create'),
    canUpdate: hasResourceAccess('templates', 'update'),
    canDelete: hasResourceAccess('templates', 'delete')
  };
}

export function useWorkflowPermissions() {
  const { hasResourceAccess } = usePermissions();
  return {
    canRead: hasResourceAccess('workflows', 'read'),
    canCreate: hasResourceAccess('workflows', 'create'),
    canUpdate: hasResourceAccess('workflows', 'update'),
    canDelete: hasResourceAccess('workflows', 'delete'),
    canExecute: hasResourceAccess('workflows', 'manage')
  };
}

export function useReportPermissions() {
  const { hasResourceAccess } = usePermissions();
  return {
    canRead: hasResourceAccess('reports', 'read'),
    canCreate: hasResourceAccess('reports', 'create'),
    canUpdate: hasResourceAccess('reports', 'update'),
    canDelete: hasResourceAccess('reports', 'delete'),
    canSchedule: hasResourceAccess('reports', 'manage')
  };
}

export function useSettingsPermissions() {
  const { hasResourceAccess } = usePermissions();
  return {
    canRead: hasResourceAccess('settings', 'read'),
    canUpdate: hasResourceAccess('settings', 'update')
  };
}

export function useIntegrationPermissions() {
  const { hasResourceAccess } = usePermissions();
  return {
    canRead: hasResourceAccess('integrations', 'read'),
    canConfigure: hasResourceAccess('integrations', 'manage')
  };
}

export function useUserManagementPermissions() {
  const { hasResourceAccess } = usePermissions();
  return {
    canInvite: hasResourceAccess('users', 'create'),
    canRemove: hasResourceAccess('users', 'delete'),
    canManageRoles: hasResourceAccess('users', 'manage')
  };
}

// ============================================
// UI Helpers
// ============================================

export function usePermissionDescription() {
  return useMemo(() => getPermissionDescription, []);
}

export function useFeatureFlags() {
  const { getOrgPersona } = usePlatformAuth();
  const persona = getOrgPersona();

  const features = useMemo(() => {
    const base = {
      giving: true,
      checkin: false,
      groups: true,
      volunteers: true,
      events: true,
      grades: false,
      inventory: false,
      projects: false
    };

    switch (persona) {
      case 'church':
        return { ...base, checkin: true, groups: true, volunteers: true };
      case 'school':
        return { ...base, grades: true, checkin: true, volunteers: false };
      case 'ngo':
        return { ...base, projects: true, volunteers: true };
      case 'sme':
        return { ...base, inventory: true, projects: true, volunteers: false };
      default:
        return base;
    }
  }, [persona]);

  return { persona, features };
}

// ============================================
// Conditional Rendering Components
// ============================================

interface CanProps {
  permission?: Permission;
  permissions?: Permission[];
  all?: boolean;
  fallback?: ReactNode;
  children: ReactNode;
}

export function Can({ permission, permissions, all = true, fallback = null, children }: CanProps) {
  const { can, canAll, canAny } = usePermissions();

  const hasAccess = useMemo(() => {
    if (permission) return can(permission);
    if (permissions && permissions.length > 0) {
      return all ? canAll(permissions) : canAny(permissions);
    }
    return true;
  }, [permission, permissions, all, can, canAll, canAny]);

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}

interface CanResourceProps {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
  fallback?: ReactNode;
  children: ReactNode;
}

export function CanResource({ resource, action, fallback = null, children }: CanResourceProps) {
  const { hasResourceAccess } = usePermissions();
  const hasAccess = hasResourceAccess(resource, action);
  return hasAccess ? <>{children}</> : <>{fallback}</>;
}

interface RoleProps {
  role: UserRole | UserRole[];
  fallback?: ReactNode;
  children: ReactNode;
}

export function Role({ role, fallback = null, children }: RoleProps) {
  const { hasRole } = usePlatformAuth();
  const roles = Array.isArray(role) ? role : [role];
  const hasAccess = roles.some(r => hasRole(r));
  return hasAccess ? <>{children}</> : <>{fallback}</>;
}