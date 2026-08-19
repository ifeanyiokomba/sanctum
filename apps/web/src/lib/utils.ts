// Re-export all utilities from the core module to avoid duplication.
// This file exists for backward compatibility with imports from '@/lib/utils'.
export { cn, formatCurrency, formatNumber, formatDate, formatDateTime, formatRelativeTime, truncate, slugify, generateId, debounce, throttle } from '@/core/utils';
