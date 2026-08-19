import { describe, it, expect } from 'vitest';
import {
  UserRole,
  Permission,
  getPermissionsForRole,
  PERSONA_ROLES,
  PERSONA_DEFAULT_ROLE,
  hasRoleInOrg,
} from '../auth';

describe('Auth & RBAC', () => {
  describe('getPermissionsForRole', () => {
    it('should return all permissions for super_admin', () => {
      const perms = getPermissionsForRole('super_admin');
      expect(perms).toContain('people:read');
      expect(perms).toContain('people:write');
      expect(perms).toContain('people:delete');
      expect(perms).toContain('transactions:reconcile');
      expect(perms).toContain('settings:write');
      expect(perms).toContain('users:manage_roles');
      expect(perms.length).toBeGreaterThan(30);
    });

    it('should return all permissions for org_admin', () => {
      const perms = getPermissionsForRole('org_admin');
      expect(perms).toContain('people:read');
      expect(perms).toContain('people:write');
      expect(perms).toContain('users:manage_roles');
    });

    it('should return read-only permissions for org_viewer', () => {
      const perms = getPermissionsForRole('org_viewer');
      expect(perms).toContain('people:read');
      expect(perms).toContain('transactions:read');
      expect(perms).toContain('events:read');
      // Should NOT have write/delete permissions
      expect(perms).not.toContain('people:write');
      expect(perms).not.toContain('people:delete');
      expect(perms).not.toContain('transactions:write');
    });

    it('should return limited permissions for volunteer', () => {
      const perms = getPermissionsForRole('volunteer');
      expect(perms).toContain('people:read');
      expect(perms).toContain('events:read');
      expect(perms).toContain('events:checkin');
      expect(perms).not.toContain('people:write');
      expect(perms).not.toContain('transactions:read');
    });

    it('should return limited permissions for student', () => {
      const perms = getPermissionsForRole('student');
      expect(perms).toContain('people:read');
      expect(perms).toContain('events:read');
      expect(perms).toContain('events:register');
      expect(perms).not.toContain('people:write');
      expect(perms).not.toContain('transactions:read');
    });

    it('should return empty array for unknown role', () => {
      const perms = getPermissionsForRole('unknown_role' as UserRole);
      expect(perms).toEqual([]);
    });
  });

  describe('PERSONA_ROLES', () => {
    it('should define roles for church persona', () => {
      expect(PERSONA_ROLES.church).toContain('org_admin');
      expect(PERSONA_ROLES.church).toContain('volunteer');
      expect(PERSONA_ROLES.church).toContain('staff');
    });

    it('should define roles for school persona', () => {
      expect(PERSONA_ROLES.school).toContain('teacher');
      expect(PERSONA_ROLES.school).toContain('parent');
      expect(PERSONA_ROLES.school).toContain('student');
    });

    it('should define roles for ngo persona', () => {
      expect(PERSONA_ROLES.ngo).toContain('volunteer');
      expect(PERSONA_ROLES.ngo).toContain('staff');
    });

    it('should define roles for sme persona', () => {
      expect(PERSONA_ROLES.sme).toContain('staff');
      expect(PERSONA_ROLES.sme).not.toContain('volunteer');
    });
  });

  describe('PERSONA_DEFAULT_ROLE', () => {
    it('should default to org_member for all personas', () => {
      expect(PERSONA_DEFAULT_ROLE.church).toBe('org_member');
      expect(PERSONA_DEFAULT_ROLE.school).toBe('org_member');
      expect(PERSONA_DEFAULT_ROLE.ngo).toBe('org_member');
      expect(PERSONA_DEFAULT_ROLE.sme).toBe('org_member');
    });
  });

  describe('hasRoleInOrg', () => {
    it('should return true when role matches', () => {
      expect(hasRoleInOrg({ role: 'org_admin', permissions: [] }, 'org_admin')).toBe(true);
    });

    it('should return true when role is in array', () => {
      expect(hasRoleInOrg({ role: 'org_admin', permissions: [] }, ['org_admin', 'org_manager'])).toBe(true);
    });

    it('should return false when role does not match', () => {
      expect(hasRoleInOrg({ role: 'org_member', permissions: [] }, 'org_admin')).toBe(false);
    });

    it('should return false for null membership', () => {
      expect(hasRoleInOrg(null, 'org_admin')).toBe(false);
    });
  });

  describe('Permission hierarchy', () => {
    it('org_admin should have more permissions than org_manager', () => {
      const adminPerms = getPermissionsForRole('org_admin');
      const managerPerms = getPermissionsForRole('org_manager');
      // Admin should have all manager permissions
      for (const perm of managerPerms) {
        expect(adminPerms).toContain(perm);
      }
    });

    it('org_manager should have more permissions than org_member', () => {
      const managerPerms = getPermissionsForRole('org_manager');
      const memberPerms = getPermissionsForRole('org_member');
      for (const perm of memberPerms) {
        expect(managerPerms).toContain(perm);
      }
    });

    it('org_member should have more permissions than org_viewer', () => {
      const memberPerms = getPermissionsForRole('org_member');
      const viewerPerms = getPermissionsForRole('org_viewer');
      for (const perm of viewerPerms) {
        expect(memberPerms).toContain(perm);
      }
    });
  });

  describe('Security invariants', () => {
    it('org_viewer should never have write permissions on any resource', () => {
      const viewerPerms = getPermissionsForRole('org_viewer');
      expect(viewerPerms).not.toContain('people:write');
      expect(viewerPerms).not.toContain('households:write');
      expect(viewerPerms).not.toContain('transactions:write');
      expect(viewerPerms).not.toContain('funds:write');
      expect(viewerPerms).not.toContain('events:write');
      expect(viewerPerms).not.toContain('settings:write');
    });

    it('volunteer should never have transaction permissions', () => {
      const volunteerPerms = getPermissionsForRole('volunteer');
      expect(volunteerPerms).not.toContain('transactions:read');
      expect(volunteerPerms).not.toContain('transactions:write');
    });

    it('student should never have delete permissions', () => {
      const studentPerms = getPermissionsForRole('student');
      expect(studentPerms).not.toContain('people:delete');
      expect(studentPerms).not.toContain('households:delete');
      expect(studentPerms).not.toContain('transactions:delete');
      expect(studentPerms).not.toContain('events:delete');
    });

    it('parent should never have write permissions', () => {
      const parentPerms = getPermissionsForRole('parent');
      expect(parentPerms).not.toContain('people:write');
      expect(parentPerms).not.toContain('transactions:write');
      expect(parentPerms).not.toContain('events:write');
    });
  });
});
