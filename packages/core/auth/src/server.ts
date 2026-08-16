import { createClerkClient, ClerkClient } from '@clerk/backend';
import { AuthUser, AuthOrganization, UserRole, Permission, SessionClaims } from './client';
import { z } from 'zod';

// ============================================
// Server-side Clerk Client
// ============================================

let clerkClient: ClerkClient | null = null;

export function getClerkClient(): ClerkClient {
  if (!clerkClient) {
    clerkClient = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY || ''
    });
  }
  return clerkClient;
}

// ============================================
// User Management
// ============================================

export async function getUser(userId: string): Promise<AuthUser | null> {
  const client = getClerkClient();
  try {
    const user = await client.users.getUser(userId);
    return user as AuthUser;
  } catch {
    return null;
  }
}

export async function getUsers(params?: { organizationId?: string; role?: UserRole }): Promise<AuthUser[]> {
  const client = getClerkClient();
  try {
    const users = await client.users.getUserList({
      organizationId: params?.organizationId
    });
    return users.data as AuthUser[];
  } catch {
    return [];
  }
}

export async function createUser(data: {
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  publicMetadata?: Record<string, any>;
  privateMetadata?: Record<string, any>;
}): Promise<AuthUser> {
  const client = getClerkClient();
  const user = await client.users.createUser(data);
  return user as AuthUser;
}

export async function updateUser(userId: string, data: Partial<AuthUser>): Promise<AuthUser> {
  const client = getClerkClient();
  const user = await client.users.updateUser(userId, data);
  return user as AuthUser;
}

export async function deleteUser(userId: string): Promise<void> {
  const client = getClerkClient();
  await client.users.deleteUser(userId);
}

export async function updateUserMetadata(
  userId: string,
  metadata: { publicMetadata?: Record<string, any>; privateMetadata?: Record<string, any> }
): Promise<AuthUser> {
  const client = getClerkClient();
  const user = await client.users.updateUser(userId, metadata);
  return user as AuthUser;
}

export async function setUserRole(userId: string, role: UserRole, orgId?: string): Promise<AuthUser> {
  const client = getClerkClient();
  const metadata = orgId
    ? { publicMetadata: { orgRoles: { [orgId]: role } } }
    : { publicMetadata: { role } };
  return updateUserMetadata(userId, metadata);
}

export async function setUserPermissions(userId: string, permissions: Permission[], orgId?: string): Promise<AuthUser> {
  const client = getClerkClient();
  const metadata = orgId
    ? { publicMetadata: { orgPermissions: { [orgId]: permissions } } }
    : { publicMetadata: { permissions } };
  return updateUserMetadata(userId, metadata);
}

// ============================================
// Organization Management
// ============================================

export async function getOrganization(orgId: string): Promise<AuthOrganization | null> {
  const client = getClerkClient();
  try {
    const org = await client.organizations.getOrganization(orgId);
    return org as AuthOrganization;
  } catch {
    return null;
  }
}

export async function getOrganizations(): Promise<AuthOrganization[]> {
  const client = getClerkClient();
  try {
    const orgs = await client.organizations.getOrganizationList();
    return orgs.data as AuthOrganization[];
  } catch {
    return [];
  }
}

export async function createOrganization(data: {
  name: string;
  slug: string;
  createdBy: string;
  publicMetadata?: Record<string, any>;
  privateMetadata?: Record<string, any>;
}): Promise<AuthOrganization> {
  const client = getClerkClient();
  const org = await client.organizations.createOrganization(data);
  return org as AuthOrganization;
}

export async function updateOrganization(orgId: string, data: Partial<AuthOrganization>): Promise<AuthOrganization> {
  const client = getClerkClient();
  const org = await client.organizations.updateOrganization(orgId, data);
  return org as AuthOrganization;
}

export async function deleteOrganization(orgId: string): Promise<void> {
  const client = getClerkClient();
  await client.organizations.deleteOrganization(orgId);
}

export async function setOrganizationPersona(
  orgId: string,
  persona: 'church' | 'school' | 'ngo' | 'sme'
): Promise<AuthOrganization> {
  return updateOrganization(orgId, {
    publicMetadata: { persona }
  });
}

// ============================================
// Organization Membership
// ============================================

export interface OrgMembership {
  id: string;
  organizationId: string;
  userId: string;
  role: UserRole;
  permissions: Permission[];
  status: 'active' | 'pending' | 'removed';
  createdAt: number;
  updatedAt: number;
}

export async function getMemberships(orgId: string): Promise<OrgMembership[]> {
  const client = getClerkClient();
  try {
    const memberships = await client.organizations.getOrganizationMembershipList({ organizationId: orgId });
    return memberships.data as OrgMembership[];
  } catch {
    return [];
  }
}

export async function getUserMemberships(userId: string): Promise<OrgMembership[]> {
  const client = getClerkClient();
  try {
    const memberships = await client.organizations.getOrganizationMembershipList({ userId });
    return memberships.data as OrgMembership[];
  } catch {
    return [];
  }
}

export async function inviteMember(
  orgId: string,
  email: string,
  role: UserRole = 'org_member',
  permissions: Permission[] = []
): Promise<OrgMembership> {
  const client = getClerkClient();
  const membership = await client.organizations.createOrganizationMembership({
    organizationId: orgId,
    emailAddress: email,
    role,
    publicMetadata: { permissions }
  });
  return membership as OrgMembership;
}

export async function updateMembership(
  orgId: string,
  userId: string,
  data: { role?: UserRole; permissions?: Permission[] }
): Promise<OrgMembership> {
  const client = getClerkClient();
  const membership = await client.organizations.updateOrganizationMembership({
    organizationId: orgId,
    userId,
    role: data.role,
    publicMetadata: data.permissions ? { permissions: data.permissions } : undefined
  });
  return membership as OrgMembership;
}

export async function removeMember(orgId: string, userId: string): Promise<void> {
  const client = getClerkClient();
  await client.organizations.deleteOrganizationMembership({ organizationId: orgId, userId });
}

// ============================================
// Session Verification
// ============================================

export async function verifyToken(token: string): Promise<SessionClaims | null> {
  const client = getClerkClient();
  try {
    const payload = await client.verifyToken(token);
    return payload as SessionClaims;
  } catch {
    return null;
  }
}

export async function getSession(sessionId: string): Promise<any> {
  const client = getClerkClient();
  try {
    return await client.sessions.getSession(sessionId);
  } catch {
    return null;
  }
}

export async function revokeSession(sessionId: string): Promise<void> {
  const client = getClerkClient();
  await client.sessions.revokeSession(sessionId);
}

export async function revokeAllUserSessions(userId: string): Promise<void> {
  const client = getClerkClient();
  const sessions = await client.sessions.getSessionList({ userId });
  await Promise.all(sessions.data.map(s => client.sessions.revokeSession(s.id)));
}

// ============================================
// Webhooks
// ============================================

export const WebhookEventType = z.enum([
  'user.created',
  'user.updated',
  'user.deleted',
  'organization.created',
  'organization.updated',
  'organization.deleted',
  'organizationMembership.created',
  'organizationMembership.updated',
  'organizationMembership.deleted',
  'session.created',
  'session.ended',
  'session.removed'
]);

export type WebhookEventType = z.infer<typeof WebhookEventType>;

export interface WebhookEvent {
  type: WebhookEventType;
  data: any;
  object: 'event';
  id: string;
  timestamp: number;
}

export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  // In production, use svix or similar
  // This is a placeholder
  return true;
}

// ============================================
// Helpers
// ============================================

export async function getUserWithOrgContext(userId: string, orgId: string): Promise<{
  user: AuthUser | null;
  membership: OrgMembership | null;
  organization: AuthOrganization | null;
}> {
  const [user, memberships, organization] = await Promise.all([
    getUser(userId),
    getMemberships(orgId),
    getOrganization(orgId)
  ]);

  const membership = memberships.find(m => m.userId === userId) || null;

  return { user, membership, organization };
}

export function hasPermissionInOrg(
  membership: OrgMembership | null,
  permission: Permission
): boolean {
  if (!membership) return false;
  return membership.permissions.includes(permission);
}

export function hasRoleInOrg(
  membership: OrgMembership | null,
  role: UserRole | UserRole[]
): boolean {
  if (!membership) return false;
  const roles = Array.isArray(role) ? role : [role];
  return roles.includes(membership.role);
}