import { ClerkProvider, useAuth, useUser, useOrganization } from '@clerk/clerk-react';
import { SignIn, SignUp, UserButton, OrganizationSwitcher, OrganizationProfile } from '@clerk/clerk-react';
import { ReactNode } from 'react';
import { z } from 'zod';

// ============================================
// Types
// ============================================

export const UserRole = z.enum([
  'super_admin',
  'org_admin',
  'org_manager',
  'org_member',
  'org_viewer',
  'volunteer',
  'staff',
  'teacher',
  'parent',
  'student'
]);
export type UserRole = z.infer<typeof UserRole>;

export const Permission = z.enum([
  // People
  'people:read',
  'people:write',
  'people:delete',
  'people:import',
  'people:export',
  // Households
  'households:read',
  'households:write',
  'households:delete',
  // Transactions
  'transactions:read',
  'transactions:write',
  'transactions:delete',
  'transactions:reconcile',
  'transactions:export',
  // Funds
  'funds:read',
  'funds:write',
  'funds:delete',
  // Events
  'events:read',
  'events:write',
  'events:delete',
  'events:checkin',
  'events:register',
  // Registrations
  'registrations:read',
  'registrations:write',
  'registrations:delete',
  // Messages
  'messages:read',
  'messages:write',
  'messages:send',
  'messages:templates',
  // Templates
  'templates:read',
  'templates:write',
  'templates:delete',
  // Workflows
  'workflows:read',
  'workflows:write',
  'workflows:delete',
  'workflows:execute',
  // Reports
  'reports:read',
  'reports:write',
  'reports:delete',
  'reports:schedule',
  // Settings
  'settings:read',
  'settings:write',
  // Integrations
  'integrations:read',
  'integrations:write',
  // Users
  'users:invite',
  'users:remove',
  'users:manage_roles'
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

// ============================================
// Clerk Provider Wrapper
// ============================================

interface ClerkProviderProps {
  children: ReactNode;
  publishableKey: string;
  afterSignInUrl?: string;
  afterSignUpUrl?: string;
}

export function PlatformClerkProvider({
  children,
  publishableKey,
  afterSignInUrl = '/dashboard',
  afterSignUpUrl = '/onboarding'
}: Omit<ClerkProviderProps, 'frontendApi'>) {
  return (
    <ClerkProvider
      publishableKey={publishableKey}
      afterSignInUrl={afterSignInUrl}
      afterSignUpUrl={afterSignUpUrl}
    >
      {children}
    </ClerkProvider>
  );
}

// ============================================
// Auth Hooks
// ============================================

export function usePlatformAuth() {
  const { userId, sessionId, orgId, orgRole, orgSlug, getToken, signOut, isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const { organization } = useOrganization();

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    const permissions = (user.publicMetadata?.permissions as Permission[]) || [];
    const orgPermissions = (organization?.publicMetadata?.permissions as Permission[]) || [];
    return permissions.includes(permission) || orgPermissions.includes(permission);
  };

  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    const userRole = user.publicMetadata?.role as UserRole | undefined;
    const orgRole = organization?.publicMetadata?.role as UserRole | undefined;
    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(userRole || orgRole || 'org_member');
  };

  const isSuperAdmin = (): boolean => {
    return hasRole('super_admin');
  };

  const isOrgAdmin = (): boolean => {
    return hasRole(['org_admin', 'super_admin']);
  };

  const getOrgPersona = (): 'church' | 'school' | 'ngo' | 'sme' | null => {
    return (organization?.publicMetadata?.persona as any) || 
           (user?.publicMetadata?.persona as any) || 
           null;
  };

  return {
    // State
    userId,
    sessionId,
    orgId,
    orgRole: orgRole as UserRole | undefined,
    orgSlug,
    isLoaded,
    isSignedIn,
    // User
    user: user as AuthUser | null,
    // Organization
    organization: organization as AuthOrganization | null,
    // Actions
    getToken,
    signOut,
    // Helpers
    hasPermission,
    hasRole,
    isSuperAdmin,
    isOrgAdmin,
    getOrgPersona
  };
}

// ============================================
// Auth Components
// ============================================

export { SignIn, SignUp, UserButton, OrganizationSwitcher, OrganizationProfile };

// Protected Route Component
interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
  requiredPermission?: Permission;
  requiredRole?: UserRole | UserRole[];
}

export function ProtectedRoute({
  children,
  fallback = null,
  requiredPermission,
  requiredRole
}: ProtectedRouteProps) {
  const { isLoaded, isSignedIn, hasPermission, hasRole } = usePlatformAuth();

  if (!isLoaded) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!isSignedIn) {
    return fallback;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return fallback;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return fallback;
  }

  return <>{children}</>;
}

// ============================================
// Server-side helpers (for API routes)
// ============================================

export async function verifySession(token: string): Promise<SessionClaims | null> {
  // In production, use Clerk's verifyToken or jose
  // This is a placeholder for server-side verification
  try {
    // const { clerkClient } = await import('@clerk/backend');
    // return await clerkClient.verifyToken(token);
    return null;
  } catch {
    return null;
  }
}

export async function getUserFromSession(token: string): Promise<AuthUser | null> {
  // const { clerkClient } = await import('@clerk/backend');
  // const session = await clerkClient.sessions.getSession(token);
  // return session.user as AuthUser;
  return null;
}