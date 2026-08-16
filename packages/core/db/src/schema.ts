import { RxJsonSchema, RxCollectionCreator } from 'rxdb';
import { ulid } from 'ulid';
import { z } from 'zod';

// ============================================
// Base Types & Zod Schemas
// ============================================

export const PersonaType = z.enum(['church', 'school', 'ngo', 'sme']);
export type PersonaType = z.infer<typeof PersonaType>;

export const TransactionType = z.enum(['income', 'expense', 'transfer']);
export type TransactionType = z.infer<typeof TransactionType>;

// Person schema - vertical-agnostic base + persona-specific data
export const PersonSchema = z.object({
  id: z.string().ulid(),
  orgId: z.string().ulid(),
  persona: PersonaType,
  // Core fields (all verticals)
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  avatarUrl: z.string().url().optional().nullable(),
  // Vertical-specific data (JSON)
  personaData: z.record(z.unknown()),
  // Household/family grouping
  householdId: z.string().ulid().optional().nullable(),
  householdRole: z.enum(['head', 'spouse', 'child', 'other']).optional().nullable(),
  // Tags & segmentation
  tags: z.array(z.string()).default([]),
  customFields: z.record(z.unknown()).default({}),
  // Metadata
  status: z.enum(['active', 'inactive', 'archived']).default('active'),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  _rev: z.string().optional(), // CouchDB revision
  _attachments: z.record(z.unknown()).optional()
});
export type Person = z.infer<typeof PersonSchema>;

// Household schema
export const HouseholdSchema = z.object({
  id: z.string().ulid(),
  orgId: z.string().ulid(),
  name: z.string().min(1),
  address: z.object({
    line1: z.string().optional(),
    line2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional()
  }).optional().nullable(),
  primaryPhone: z.string().optional().nullable(),
  primaryEmail: z.string().email().optional().nullable(),
  personaData: z.record(z.unknown()).default({}),
  tags: z.array(z.string()).default([]),
  customFields: z.record(z.unknown()).default({}),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  _rev: z.string().optional(),
  _attachments: z.record(z.unknown()).optional()
});
export type Household = z.infer<typeof HouseholdSchema>;

// Transaction schema (double-entry foundation)
export const TransactionSchema = z.object({
  id: z.string().ulid(),
  orgId: z.string().ulid(),
  type: TransactionType,
  amountCents: z.number().int(),
  currency: z.string().length(3).default('USD'),
  // Fund accounting
  fundId: z.string().ulid().optional().nullable(),
  // Source/destination (person, donor, customer, vendor, etc.)
  sourceId: z.string().ulid().optional().nullable(),
  sourceType: z.enum(['person', 'donor', 'customer', 'vendor', 'fund', 'system']).optional().nullable(),
  destinationId: z.string().ulid().optional().nullable(),
  destinationType: z.enum(['person', 'donor', 'customer', 'vendor', 'fund', 'system']).optional().nullable(),
  // Categorization
  category: z.string().optional().nullable(),
  subcategory: z.string().optional().nullable(),
  // Reference
  reference: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  // Dates
  postedAt: z.string().datetime(),
  // Reconciliation
  reconciled: z.boolean().default(false),
  reconciledAt: z.string().datetime().optional().nullable(),
  // Metadata
  metadata: z.record(z.unknown()).default({}),
  // Persona-specific
  personaData: z.record(z.unknown()).default({}),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  _rev: z.string().optional(),
  _attachments: z.record(z.unknown()).optional()
});
export type Transaction = z.infer<typeof TransactionSchema>;

// Fund schema (fund accounting for churches/NGOs)
export const FundSchema = z.object({
  id: z.string().ulid(),
  orgId: z.string().ulid(),
  name: z.string().min(1),
  code: z.string().min(1).max(20),
  description: z.string().optional().nullable(),
  type: z.enum(['unrestricted', 'temporarily_restricted', 'permanently_restricted', 'designated']),
  parentId: z.string().ulid().optional().nullable(),
  isActive: z.boolean().default(true),
  // Budget
  budgetCents: z.number().int().optional().nullable(),
  budgetStartDate: z.string().datetime().optional().nullable(),
  budgetEndDate: z.string().datetime().optional().nullable(),
  // Metadata
  color: z.string().optional().nullable(),
  tags: z.array(z.string()).default([]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  _rev: z.string().optional(),
  _attachments: z.record(z.unknown()).optional()
});
export type Fund = z.infer<typeof FundSchema>;

// Event schema
export const EventSchema = z.object({
  id: z.string().ulid(),
  orgId: z.string().ulid(),
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  // Scheduling
  startAt: z.string().datetime(),
  endAt: z.string().datetime().optional().nullable(),
  timezone: z.string().default('UTC'),
  // Recurrence
  rrule: z.string().optional().nullable(), // RFC 5545
  // Location
  location: z.object({
    name: z.string().optional(),
    address: z.string().optional(),
    virtualUrl: z.string().url().optional(),
    coordinates: z.object({ lat: z.number(), lng: z.number() }).optional()
  }).optional().nullable(),
  // Capacity
  capacity: z.number().int().positive().optional().nullable(),
  // Registration
  registrationRequired: z.boolean().default(false),
  registrationOpensAt: z.string().datetime().optional().nullable(),
  registrationClosesAt: z.string().datetime().optional().nullable(),
  // Categorization
  category: z.string().optional().nullable(),
  tags: z.array(z.string()).default([]),
  // Metadata
  metadata: z.record(z.unknown()).default({}),
  personaData: z.record(z.unknown()).default({}),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  _rev: z.string().optional(),
  _attachments: z.record(z.unknown()).optional()
});
export type Event = z.infer<typeof EventSchema>;

// Event Registration schema
export const EventRegistrationSchema = z.object({
  id: z.string().ulid(),
  orgId: z.string().ulid(),
  eventId: z.string().ulid(),
  personId: z.string().ulid(),
  status: z.enum(['pending', 'confirmed', 'waitlisted', 'cancelled', 'attended', 'no_show']),
  registeredAt: z.string().datetime(),
  confirmedAt: z.string().datetime().optional().nullable(),
  checkedInAt: z.string().datetime().optional().nullable(),
  // Guest info
  guestCount: z.number().int().default(0),
  guestNames: z.array(z.string()).default([]),
  // Payment
  amountPaidCents: z.number().int().default(0),
  paymentStatus: z.enum(['free', 'pending', 'paid', 'refunded', 'waived']),
  // Metadata
  metadata: z.record(z.unknown()).default({}),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  _rev: z.string().optional(),
  _attachments: z.record(z.unknown()).optional()
});
export type EventRegistration = z.infer<typeof EventRegistrationSchema>;

// Communication Message schema
export const MessageSchema = z.object({
  id: z.string().ulid(),
  orgId: z.string().ulid(),
  type: z.enum(['email', 'sms', 'push', 'in_app']),
  // Recipients
  to: z.array(z.object({
    personId: z.string().ulid().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    token: z.string().optional() // push token
  })).min(1),
  // Content
  subject: z.string().optional().nullable(),
  body: z.string(),
  bodyHtml: z.string().optional().nullable(),
  templateId: z.string().ulid().optional().nullable(),
  // Status
  status: z.enum(['draft', 'queued', 'sending', 'sent', 'delivered', 'failed', 'bounced']),
  sentAt: z.string().datetime().optional().nullable(),
  deliveredAt: z.string().datetime().optional().nullable(),
  // Tracking
  opens: z.number().int().default(0),
  clicks: z.number().int().default(0),
  // Metadata
  metadata: z.record(z.unknown()).default({}),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  _rev: z.string().optional(),
  _attachments: z.record(z.unknown()).optional()
});
export type Message = z.infer<typeof MessageSchema>;

// Communication Template schema
export const TemplateSchema = z.object({
  id: z.string().ulid(),
  orgId: z.string().ulid(),
  name: z.string().min(1),
  description: z.string().optional().nullable(),
  type: z.enum(['email', 'sms', 'push', 'in_app']),
  subject: z.string().optional().nullable(),
  body: z.string(),
  bodyHtml: z.string().optional().nullable(),
  variables: z.array(z.string()).default([]),
  isSystem: z.boolean().default(false),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  _rev: z.string().optional(),
  _attachments: z.record(z.unknown()).optional()
});
export type Template = z.infer<typeof TemplateSchema>;

// Workflow schema
export const WorkflowSchema = z.object({
  id: z.string().ulid(),
  orgId: z.string().ulid(),
  name: z.string().min(1),
  description: z.string().optional().nullable(),
  trigger: z.object({
    type: z.enum(['event', 'schedule', 'webhook', 'manual']),
    config: z.record(z.unknown())
  }),
  steps: z.array(z.object({
    id: z.string(),
    type: z.enum(['action', 'condition', 'delay', 'webhook', 'notification']),
    config: z.record(z.unknown()),
    nextOnSuccess: z.string().optional(),
    nextOnFailure: z.string().optional()
  })),
  isActive: z.boolean().default(true),
  version: z.number().int().default(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  _rev: z.string().optional(),
  _attachments: z.record(z.unknown()).optional()
});
export type Workflow = z.infer<typeof WorkflowSchema>;

// Workflow Execution schema
export const WorkflowExecutionSchema = z.object({
  id: z.string().ulid(),
  orgId: z.string().ulid(),
  workflowId: z.string().ulid(),
  status: z.enum(['pending', 'running', 'completed', 'failed', 'cancelled']),
  currentStepId: z.string().optional().nullable(),
  input: z.record(z.unknown()).default({}),
  output: z.record(z.unknown()).default({}),
  error: z.string().optional().nullable(),
  startedAt: z.string().datetime(),
  completedAt: z.string().datetime().optional().nullable(),
  _rev: z.string().optional(),
  _attachments: z.record(z.unknown()).optional()
});
export type WorkflowExecution = z.infer<typeof WorkflowExecutionSchema>;

// Report schema
export const ReportSchema = z.object({
  id: z.string().ulid(),
  orgId: z.string().ulid(),
  name: z.string().min(1),
  description: z.string().optional().nullable(),
  type: z.enum(['builtin', 'custom', 'scheduled']),
  // Query definition
  query: z.object({
    collection: z.string(),
    filters: z.record(z.unknown()).default({}),
    groupBy: z.array(z.string()).default([]),
    aggregates: z.array(z.object({
      field: z.string(),
      operation: z.enum(['count', 'sum', 'avg', 'min', 'max', 'distinct'])
    })).default([]),
    orderBy: z.array(z.object({
      field: z.string(),
      direction: z.enum(['asc', 'desc'])
    })).default([]),
    limit: z.number().int().positive().optional()
  }),
  // Visualization
  visualization: z.object({
    type: z.enum(['table', 'line', 'bar', 'pie', 'area', 'scatter', 'kpi', 'funnel']),
    config: z.record(z.unknown()).default({})
  }).optional().nullable(),
  // Scheduling
  schedule: z.object({
    cron: z.string().optional(),
    timezone: z.string().default('UTC'),
    recipients: z.array(z.string().email()).default([]),
    format: z.enum(['pdf', 'csv', 'xlsx', 'html']).default('pdf')
  }).optional().nullable(),
  // Access
  isPublic: z.boolean().default(false),
  roles: z.array(z.string()).default([]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  _rev: z.string().optional(),
  _attachments: z.record(z.unknown()).optional()
});
export type Report = z.infer<typeof ReportSchema>;

// Organization settings schema
export const OrganizationSettingsSchema = z.object({
  id: z.string().ulid(),
  orgId: z.string().ulid(),
  persona: PersonaType,
  // Vocabulary overrides
  vocabulary: z.object({
    person: z.string().default('Member'),
    household: z.string().default('Household'),
    transaction: z.string().default('Transaction'),
    group: z.string().default('Group'),
    event: z.string().default('Event')
  }).optional(),
  // Feature flags
  features: z.object({
    giving: z.boolean().default(true),
    checkin: z.boolean().default(false),
    groups: z.boolean().default(true),
    volunteers: z.boolean().default(true),
    events: z.boolean().default(true),
    grades: z.boolean().default(false),
    inventory: z.boolean().default(false),
    projects: z.boolean().default(false)
  }).default({}),
  // Compliance
  compliance: z.object({
    childSafety: z.boolean().default(false),
    pciDss: z.boolean().default(false),
    ferpa: z.boolean().default(false),
    coppa: z.boolean().default(false),
    gaap: z.boolean().default(false),
    sox: z.boolean().default(false),
    hipaa: z.boolean().default(false)
  }).default({}),
  // Integrations
  integrations: z.record(z.object({
    enabled: z.boolean().default(false),
    config: z.record(z.unknown()).default({})
  })).default({}),
  // Branding
  branding: z.object({
    primaryColor: z.string().default('#2563eb'),
    secondaryColor: z.string().default('#64748b'),
    logoUrl: z.string().url().optional().nullable(),
    faviconUrl: z.string().url().optional().nullable()
  }).default({}),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  _rev: z.string().optional(),
  _attachments: z.record(z.unknown()).optional()
});
export type OrganizationSettings = z.infer<typeof OrganizationSettingsSchema>;

// ============================================
// RxDB JSON Schemas
// ============================================

function toRxJsonSchema<T extends z.ZodObject<any>>(schema: T): RxJsonSchema<z.infer<T>> {
  const shape = schema.shape;
  const properties: Record<string, any> = {};
  const required: string[] = [];

  for (const [key, value] of Object.entries(shape)) {
    const zodType = value as z.ZodTypeAny;
    const isOptional = zodType.isOptional?.() || zodType._def?.typeName === 'ZodOptional';
    const isNullable = zodType._def?.typeName === 'ZodNullable';

    if (!isOptional) {
      required.push(key);
    }

    properties[key] = zodToJsonSchema(zodType);
  }

  return {
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties,
    required,
    indexes: ['orgId', 'createdAt', 'updatedAt'],
    attachments: true
  };
}

function zodToJsonSchema(zodType: z.ZodTypeAny): any {
  const def = zodType._def;

  switch (def.typeName) {
    case 'ZodString':
      return { type: 'string', format: def.checks?.find((c: any) => c.kind === 'email') ? 'email' : 
                      def.checks?.find((c: any) => c.kind === 'url') ? 'uri' :
                      def.checks?.find((c: any) => c.kind === 'datetime') ? 'date-time' : undefined };
    case 'ZodNumber':
      return { type: def.checks?.some((c: any) => c.kind === 'int') ? 'integer' : 'number' };
    case 'ZodBoolean':
      return { type: 'boolean' };
    case 'ZodArray':
      return { type: 'array', items: zodToJsonSchema(def.type) };
    case 'ZodObject':
      const props: Record<string, any> = {};
      const req: string[] = [];
      for (const [k, v] of Object.entries(def.shape())) {
        const vType = v as z.ZodTypeAny;
        if (!vType.isOptional?.()) req.push(k);
        props[k] = zodToJsonSchema(vType);
      }
      return { type: 'object', properties: props, required: req };
    case 'ZodRecord':
      return { type: 'object', additionalProperties: zodToJsonSchema(def.valueType) };
    case 'ZodEnum':
      return { type: 'string', enum: def.values };
    case 'ZodOptional':
      return zodToJsonSchema(def.innerType);
    case 'ZodNullable':
      return { ...zodToJsonSchema(def.innerType), nullable: true };
    case 'ZodDefault':
      return { ...zodToJsonSchema(def.innerType), default: def.defaultValue() };
    case 'ZodUnion':
      return { anyOf: def.options.map((o: any) => zodToJsonSchema(o)) };
    default:
      return { type: 'object' };
  }
}

// Generate RxDB collection creators
export const personSchema: RxJsonSchema<Person> = toRxJsonSchema(PersonSchema);
export const householdSchema: RxJsonSchema<Household> = toRxJsonSchema(HouseholdSchema);
export const transactionSchema: RxJsonSchema<Transaction> = toRxJsonSchema(TransactionSchema);
export const fundSchema: RxJsonSchema<Fund> = toRxJsonSchema(FundSchema);
export const eventSchema: RxJsonSchema<Event> = toRxJsonSchema(EventSchema);
export const eventRegistrationSchema: RxJsonSchema<EventRegistration> = toRxJsonSchema(EventRegistrationSchema);
export const messageSchema: RxJsonSchema<Message> = toRxJsonSchema(MessageSchema);
export const templateSchema: RxJsonSchema<Template> = toRxJsonSchema(TemplateSchema);
export const workflowSchema: RxJsonSchema<Workflow> = toRxJsonSchema(WorkflowSchema);
export const workflowExecutionSchema: RxJsonSchema<WorkflowExecution> = toRxJsonSchema(WorkflowExecutionSchema);
export const reportSchema: RxJsonSchema<Report> = toRxJsonSchema(ReportSchema);
export const organizationSettingsSchema: RxJsonSchema<OrganizationSettings> = toRxJsonSchema(OrganizationSettingsSchema);

// ============================================
// Collection Names & Indexes
// ============================================

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
  organizationSettings: 'organization_settings'
} as const;

export const COMMON_INDEXES = [
  ['orgId', 'createdAt'],
  ['orgId', 'updatedAt'],
  ['orgId', 'status']
];

// ============================================
// Helper Functions
// ============================================

export function createId(): string {
  return ulid();
}

export function nowISO(): string {
  return new Date().toISOString();
}

export function validatePerson(data: unknown): Person {
  return PersonSchema.parse(data);
}

export function validateTransaction(data: unknown): Transaction {
  return TransactionSchema.parse(data);
}

export function validateEvent(data: unknown): Event {
  return EventSchema.parse(data);
}