export interface Person {
  id: string;
  orgId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  status: 'active' | 'inactive' | 'archived';
  householdId?: string;
  householdRole?: 'head' | 'spouse' | 'child' | 'other';
  tags: string[];
  customFields: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Household {
  id: string;
  orgId: string;
  name: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  primaryPhone?: string;
  primaryEmail?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  orgId: string;
  type: 'income' | 'expense' | 'transfer';
  amountCents: number;
  currency: string;
  fundId?: string;
  sourceId?: string;
  sourceType?: 'person' | 'donor' | 'customer' | 'vendor' | 'fund' | 'system';
  destinationId?: string;
  destinationType?: 'person' | 'donor' | 'customer' | 'vendor' | 'fund' | 'system';
  category?: string;
  subcategory?: string;
  reference?: string;
  description?: string;
  postedAt: string;
  reconciled: boolean;
  reconciledAt?: string;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Fund {
  id: string;
  orgId: string;
  name: string;
  code: string;
  description?: string;
  type: 'unrestricted' | 'temporarily_restricted' | 'permanently_restricted' | 'designated';
  parentId?: string;
  isActive: boolean;
  budgetCents?: number;
  budgetStartDate?: string;
  budgetEndDate?: string;
  color?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  orgId: string;
  title: string;
  description?: string;
  startAt: string;
  endAt?: string;
  timezone: string;
  rrule?: string;
  location?: {
    name?: string;
    address?: string;
    virtualUrl?: string;
    coordinates?: { lat: number; lng: number };
  };
  capacity?: number;
  registrationRequired: boolean;
  registrationOpensAt?: string;
  registrationClosesAt?: string;
  category?: string;
  tags: string[];
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface EventRegistration {
  id: string;
  orgId: string;
  eventId: string;
  personId: string;
  status: 'pending' | 'confirmed' | 'waitlisted' | 'cancelled' | 'attended' | 'no_show';
  registeredAt: string;
  confirmedAt?: string;
  checkedInAt?: string;
  guestCount: number;
  guestNames: string[];
  amountPaidCents: number;
  paymentStatus: 'free' | 'pending' | 'paid' | 'refunded' | 'waived';
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  orgId: string;
  type: 'email' | 'sms' | 'push' | 'in_app';
  to: Array<{
    personId?: string;
    email?: string;
    phone?: string;
    token?: string;
  }>;
  subject?: string;
  body: string;
  bodyHtml?: string;
  templateId?: string;
  status: 'draft' | 'queued' | 'sending' | 'sent' | 'delivered' | 'failed' | 'bounced';
  sentAt?: string;
  deliveredAt?: string;
  opens: number;
  clicks: number;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Template {
  id: string;
  orgId: string;
  name: string;
  description?: string;
  type: 'email' | 'sms' | 'push' | 'in_app';
  subject?: string;
  body: string;
  bodyHtml?: string;
  variables: string[];
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Workflow {
  id: string;
  orgId: string;
  name: string;
  description?: string;
  trigger: {
    type: 'event' | 'schedule' | 'webhook' | 'manual';
    config: Record<string, any>;
  };
  steps: Array<{
    id: string;
    type: 'action' | 'condition' | 'delay' | 'webhook' | 'notification';
    config: Record<string, any>;
    nextOnSuccess?: string;
    nextOnFailure?: string;
  }>;
  isActive: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowExecution {
  id: string;
  orgId: string;
  workflowId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  currentStepId?: string;
  input: Record<string, any>;
  output: Record<string, any>;
  error?: string;
  startedAt: string;
  completedAt?: string;
}

export interface Report {
  id: string;
  orgId: string;
  name: string;
  description?: string;
  type: 'builtin' | 'custom' | 'scheduled';
  query: {
    collection: string;
    filters: Record<string, any>;
    groupBy: string[];
    aggregates: Array<{
      field: string;
      operation: 'count' | 'sum' | 'avg' | 'min' | 'max' | 'distinct';
    }>;
    orderBy: Array<{
      field: string;
      direction: 'asc' | 'desc';
    }>;
    limit?: number;
  };
  visualization?: {
    type: 'table' | 'line' | 'bar' | 'pie' | 'area' | 'scatter' | 'kpi' | 'funnel';
    config: Record<string, any>;
  };
  schedule?: {
    cron: string;
    timezone: string;
    recipients: string[];
    format: 'pdf' | 'csv' | 'xlsx' | 'html';
  };
  isPublic: boolean;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationSettings {
  id: string;
  orgId: string;
  persona: 'church' | 'school' | 'ngo' | 'sme';
  vocabulary: {
    person: string;
    household: string;
    transaction: string;
    group: string;
    event: string;
  };
  features: {
    giving: boolean;
    checkin: boolean;
    groups: boolean;
    volunteers: boolean;
    events: boolean;
    grades: boolean;
    inventory: boolean;
    projects: boolean;
  };
  compliance: {
    childSafety: boolean;
    pciDss: boolean;
    ferpa: boolean;
    coppa: boolean;
    gaap: boolean;
    sox: boolean;
    hipaa: boolean;
  };
  integrations: Record<string, { enabled: boolean; config: Record<string, any> }>;
  branding: {
    primaryColor: string;
    secondaryColor: string;
    logoUrl?: string;
    faviconUrl?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const COLLECTIONS = {
  people: 'people',
  households: 'households',
  transactions: 'transactions',
  funds: 'funds',
  events: 'events',
  eventRegistrations: 'event_registrations',
  messages: 'messages',
  templates: 'templates',
  workflows: 'workflows',
  workflowExecutions: 'workflow_executions',
  reports: 'reports',
  organizationSettings: 'organization_settings',
} as const;

export function createId(): string {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
}

export function nowISO(): string {
  return new Date().toISOString();
}