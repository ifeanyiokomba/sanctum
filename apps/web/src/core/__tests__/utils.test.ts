import { describe, it, expect } from 'vitest';
import {
  cn,
  formatCurrency,
  formatNumber,
  formatDate,
  formatDateTime,
  formatRelativeTime,
  truncate,
  slugify,
  generateId,
} from '../utils';

describe('Utility Functions', () => {
  describe('cn', () => {
    it('should merge class names', () => {
      const result = cn('text-red-500', 'text-blue-500');
      expect(result).toBe('text-blue-500');
    });

    it('should handle conditional classes', () => {
      const result = cn('base', false && 'hidden', 'extra');
      expect(result).toContain('base');
      expect(result).toContain('extra');
      expect(result).not.toContain('hidden');
    });
  });

  describe('formatCurrency', () => {
    it('should format cents to USD currency', () => {
      expect(formatCurrency(1000)).toBe('$10.00');
      expect(formatCurrency(0)).toBe('$0.00');
      expect(formatCurrency(15050)).toBe('$150.50');
    });

    it('should handle negative amounts', () => {
      expect(formatCurrency(-500)).toBe('-$5.00');
    });

    it('should support different currencies', () => {
      const result = formatCurrency(1000, 'NGN');
      expect(result).toContain('10');
    });
  });

  describe('formatNumber', () => {
    it('should format numbers with commas', () => {
      expect(formatNumber(1234567)).toBe('1,234,567');
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(0)).toBe('0');
    });
  });

  describe('formatDate', () => {
    it('should format ISO date strings', () => {
      const result = formatDate('2024-01-15');
      expect(result).toContain('Jan');
      expect(result).toContain('15');
      expect(result).toContain('2024');
    });
  });

  describe('truncate', () => {
    it('should truncate long strings', () => {
      expect(truncate('Hello World', 5)).toBe('Hello...');
    });

    it('should not truncate short strings', () => {
      expect(truncate('Hi', 5)).toBe('Hi');
    });

    it('should handle exact length strings', () => {
      expect(truncate('Hello', 5)).toBe('Hello');
    });
  });

  describe('slugify', () => {
    it('should create URL-safe slugs', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('My Org Name!')).toBe('my-org-name');
      expect(slugify('  spaces  ')).toBe('spaces');
    });

    it('should handle special characters', () => {
      expect(slugify('Org & Co.')).toBe('org-co');
      expect(slugify('Test@#$%Name')).toBe('testname');
    });
  });

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });

    it('should generate non-empty strings', () => {
      const id = generateId();
      expect(id.length).toBeGreaterThan(10);
    });
  });
});
