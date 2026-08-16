import { createRxDatabase, RxDatabase, RxCollection, RxJsonSchema } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { addRxPlugin } from 'rxdb';
import { RxDBReplicationCouchDBPlugin } from 'rxdb/plugins/replication-couchdb';
import { wrappedValidateAjv as validateAjv } from 'rxdb/plugins/validate-ajv';
import { RxDBLeaderElectionPlugin } from 'rxdb/plugins/leader-election';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';

import {
  COLLECTIONS,
  personSchema,
  householdSchema,
  transactionSchema,
  fundSchema,
  eventSchema,
  eventRegistrationSchema,
  messageSchema,
  templateSchema,
  workflowSchema,
  workflowExecutionSchema,
  reportSchema,
  organizationSettingsSchema,
  Person,
  Household,
  Transaction,
  Fund,
  Event,
  EventRegistration,
  Message,
  Template,
  Workflow,
  WorkflowExecution,
  Report,
  OrganizationSettings,
  PersonaType
} from './schema';

import { replication } from './replication';

// Add required plugins
addRxPlugin(RxDBReplicationCouchDBPlugin);
addRxPlugin(validateAjv);
addRxPlugin(RxDBLeaderElectionPlugin);
addRxPlugin(RxDBUpdatePlugin);

if (process.env.NODE_ENV === 'development') {
  addRxPlugin(RxDBDevModePlugin);
}

// ============================================
// Database Creation
// ============================================

export interface PlatformDatabase extends RxDatabase {
  people: RxCollection<Person>;
  households: RxCollection<Household>;
  transactions: RxCollection<Transaction>;
  funds: RxCollection<Fund>;
  events: RxCollection<Event>;
  eventRegistrations: RxCollection<EventRegistration>;
  messages: RxCollection<Message>;
  templates: RxCollection<Template>;
  workflows: RxCollection<Workflow>;
  workflowExecutions: RxCollection<WorkflowExecution>;
  reports: RxCollection<Report>;
  organizationSettings: RxCollection<OrganizationSettings>;
}

export async function createPlatformDatabase(
  name: string,
  options?: { multiInstance?: boolean }
): Promise<PlatformDatabase> {
  const db = await createRxDatabase<PlatformDatabase>({
    name,
    storage: getRxStorageDexie(),
    multiInstance: options?.multiInstance ?? true,
    eventReduce: true,
    ignoreDuplicate: true
  });

  // Add collections
  await Promise.all([
    db.addCollections({
      people: { schema: personSchema },
      households: { schema: householdSchema },
      transactions: { schema: transactionSchema },
      funds: { schema: fundSchema },
      events: { schema: eventSchema },
      eventRegistrations: { schema: eventRegistrationSchema },
      messages: { schema: messageSchema },
      templates: { schema: templateSchema },
      workflows: { schema: workflowSchema },
      workflowExecutions: { schema: workflowExecutionSchema },
      reports: { schema: reportSchema },
      organizationSettings: { schema: organizationSettingsSchema }
    })
  ]);

  // Add indexes
  await addIndexes(db);

  return db;
}

async function addIndexes(db: PlatformDatabase): Promise<void> {
  const indexPromises = [
    db.people.addIndex({ index: ['orgId', 'createdAt'] }),
    db.people.addIndex({ index: ['orgId', 'updatedAt'] }),
    db.people.addIndex({ index: ['orgId', 'status'] }),
    db.people.addIndex({ index: ['orgId', 'householdId'] }),
    db.people.addIndex({ index: ['orgId', 'tags'] }),
    db.households.addIndex({ index: ['orgId', 'createdAt'] }),
    db.transactions.addIndex({ index: ['orgId', 'postedAt'] }),
    db.transactions.addIndex({ index: ['orgId', 'fundId'] }),
    db.transactions.addIndex({ index: ['orgId', 'sourceId'] }),
    db.transactions.addIndex({ index: ['orgId', 'category'] }),
    db.transactions.addIndex({ index: ['orgId', 'reconciled'] }),
    db.funds.addIndex({ index: ['orgId', 'type'] }),
    db.funds.addIndex({ index: ['orgId', 'isActive'] }),
    db.events.addIndex({ index: ['orgId', 'startAt'] }),
    db.events.addIndex({ index: ['orgId', 'category'] }),
    db.eventRegistrations.addIndex({ index: ['orgId', 'eventId'] }),
    db.eventRegistrations.addIndex({ index: ['orgId', 'personId'] }),
    db.eventRegistrations.addIndex({ index: ['orgId', 'status'] }),
    db.messages.addIndex({ index: ['orgId', 'status'] }),
    db.messages.addIndex({ index: ['orgId', 'sentAt'] }),
    db.templates.addIndex({ index: ['orgId', 'type'] }),
    db.workflows.addIndex({ index: ['orgId', 'isActive'] }),
    db.workflowExecutions.addIndex({ index: ['orgId', 'workflowId'] }),
    db.workflowExecutions.addIndex({ index: ['orgId', 'status'] }),
    db.reports.addIndex({ index: ['orgId', 'type'] })
  ];

  await Promise.all(indexPromises);
}

// ============================================
// Database Instance Management
// ============================================

let dbInstance: PlatformDatabase | null = null;
let dbInitPromise: Promise<PlatformDatabase> | null = null;

export function getDatabase(): PlatformDatabase | null {
  return dbInstance;
}

export async function initDatabase(
  orgId: string,
  options?: { multiInstance?: boolean; couchDBUrl?: string }
): Promise<PlatformDatabase> {
  if (dbInstance) {
    return dbInstance;
  }

  if (dbInitPromise) {
    return dbInitPromise;
  }

  dbInitPromise = (async () => {
    const dbName = `platform_${orgId}`;
    const db = await createPlatformDatabase(dbName, options);

    // Set up replication if CouchDB URL provided
    if (options?.couchDBUrl) {
      await replication.setupReplication(db, options.couchDBUrl, orgId);
    }

    dbInstance = db;
    return db;
  })();

  return dbInitPromise;
}

export function closeDatabase(): Promise<void> {
  if (dbInstance) {
    const promise = dbInstance.close();
    dbInstance = null;
    dbInitPromise = null;
    return promise;
  }
  return Promise.resolve();
}

export function destroyDatabase(name: string): Promise<void> {
  return getRxStorageDexie().removeDatabase(name);
}

// ============================================
// Query Helpers
// ============================================

export const queries = {
  // People
  getPeopleByOrg: (db: PlatformDatabase, orgId: string) =>
    db.people.find({ selector: { orgId } }).exec(),

  getPersonById: (db: PlatformDatabase, orgId: string, id: string) =>
    db.people.findOne({ selector: { orgId, id } }).exec(),

  getPeopleByHousehold: (db: PlatformDatabase, orgId: string, householdId: string) =>
    db.people.find({ selector: { orgId, householdId } }).exec(),

  getPeopleByTag: (db: PlatformDatabase, orgId: string, tag: string) =>
    db.people.find({ selector: { orgId, tags: tag } }).exec(),

  // Households
  getHouseholdsByOrg: (db: PlatformDatabase, orgId: string) =>
    db.households.find({ selector: { orgId } }).exec(),

  getHouseholdById: (db: PlatformDatabase, orgId: string, id: string) =>
    db.households.findOne({ selector: { orgId, id } }).exec(),

  // Transactions
  getTransactionsByOrg: (db: PlatformDatabase, orgId: string, limit = 100) =>
    db.transactions.find({
      selector: { orgId },
      sort: [{ postedAt: 'desc' }],
      limit
    }).exec(),

  getTransactionsByFund: (db: PlatformDatabase, orgId: string, fundId: string) =>
    db.transactions.find({ selector: { orgId, fundId } }).exec(),

  getTransactionsByDateRange: (
    db: PlatformDatabase,
    orgId: string,
    startDate: string,
    endDate: string
  ) =>
    db.transactions.find({
      selector: {
        orgId,
        postedAt: { $gte: startDate, $lte: endDate }
      },
      sort: [{ postedAt: 'desc' }]
    }).exec(),

  getUnreconciledTransactions: (db: PlatformDatabase, orgId: string) =>
    db.transactions.find({ selector: { orgId, reconciled: false } }).exec(),

  // Funds
  getFundsByOrg: (db: PlatformDatabase, orgId: string) =>
    db.funds.find({ selector: { orgId, isActive: true } }).exec(),

  getFundById: (db: PlatformDatabase, orgId: string, id: string) =>
    db.funds.findOne({ selector: { orgId, id } }).exec(),

  // Events
  getUpcomingEvents: (db: PlatformDatabase, orgId: string, limit = 20) =>
    db.events.find({
      selector: {
        orgId,
        startAt: { $gte: new Date().toISOString() }
      },
      sort: [{ startAt: 'asc' }],
      limit
    }).exec(),

  getEventsByDateRange: (
    db: PlatformDatabase,
    orgId: string,
    startDate: string,
    endDate: string
  ) =>
    db.events.find({
      selector: {
        orgId,
        startAt: { $gte: startDate, $lte: endDate }
      },
      sort: [{ startAt: 'asc' }]
    }).exec(),

  getEventById: (db: PlatformDatabase, orgId: string, id: string) =>
    db.events.findOne({ selector: { orgId, id } }).exec(),

  // Event Registrations
  getRegistrationsByEvent: (db: PlatformDatabase, orgId: string, eventId: string) =>
    db.eventRegistrations.find({ selector: { orgId, eventId } }).exec(),

  getRegistrationsByPerson: (db: PlatformDatabase, orgId: string, personId: string) =>
    db.eventRegistrations.find({ selector: { orgId, personId } }).exec(),

  // Messages
  getQueuedMessages: (db: PlatformDatabase, orgId: string) =>
    db.messages.find({ selector: { orgId, status: 'queued' } }).exec(),

  getMessagesByStatus: (db: PlatformDatabase, orgId: string, status: string) =>
    db.messages.find({ selector: { orgId, status } }).exec(),

  // Templates
  getTemplatesByOrg: (db: PlatformDatabase, orgId: string, type?: string) =>
    db.templates.find({
      selector: type ? { orgId, type } : { orgId }
    }).exec(),

  // Workflows
  getActiveWorkflows: (db: PlatformDatabase, orgId: string) =>
    db.workflows.find({ selector: { orgId, isActive: true } }).exec(),

  // Reports
  getReportsByOrg: (db: PlatformDatabase, orgId: string) =>
    db.reports.find({ selector: { orgId } }).exec()
};

// ============================================
// Mutation Helpers (Optimistic Updates)
// ============================================

export const mutations = {
  // People
  async upsertPerson(
    db: PlatformDatabase,
    person: Omit<Person, '_rev' | '_attachments'>
  ): Promise<Person> {
    const existing = await db.people.findOne({ selector: { id: person.id } }).exec();
    if (existing) {
      const updated = await existing.atomicPatch({
        ...person,
        updatedAt: new Date().toISOString()
      }).exec();
      return updated as Person;
    } else {
      const doc = await db.people.insert({
        ...person,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return doc as Person;
    }
  },

  async deletePerson(db: PlatformDatabase, id: string): Promise<void> {
    const doc = await db.people.findOne({ selector: { id } }).exec();
    if (doc) {
      await doc.remove();
    }
  },

  // Households
  async upsertHousehold(
    db: PlatformDatabase,
    household: Omit<Household, '_rev' | '_attachments'>
  ): Promise<Household> {
    const existing = await db.households.findOne({ selector: { id: household.id } }).exec();
    if (existing) {
      const updated = await existing.atomicPatch({
        ...household,
        updatedAt: new Date().toISOString()
      }).exec();
      return updated as Household;
    } else {
      const doc = await db.households.insert({
        ...household,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return doc as Household;
    }
  },

  // Transactions
  async insertTransaction(
    db: PlatformDatabase,
    transaction: Omit<Transaction, '_rev' | '_attachments'>
  ): Promise<Transaction> {
    const doc = await db.transactions.insert({
      ...transaction,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return doc as Transaction;
  },

  async reconcileTransaction(db: PlatformDatabase, id: string): Promise<void> {
    const doc = await db.transactions.findOne({ selector: { id } }).exec();
    if (doc) {
      await doc.atomicPatch({
        reconciled: true,
        reconciledAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }).exec();
    }
  },

  // Events
  async upsertEvent(
    db: PlatformDatabase,
    event: Omit<Event, '_rev' | '_attachments'>
  ): Promise<Event> {
    const existing = await db.events.findOne({ selector: { id: event.id } }).exec();
    if (existing) {
      const updated = await existing.atomicPatch({
        ...event,
        updatedAt: new Date().toISOString()
      }).exec();
      return updated as Event;
    } else {
      const doc = await db.events.insert({
        ...event,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return doc as Event;
    }
  },

  // Event Registrations
  async upsertRegistration(
    db: PlatformDatabase,
    registration: Omit<EventRegistration, '_rev' | '_attachments'>
  ): Promise<EventRegistration> {
    const existing = await db.eventRegistrations.findOne({ selector: { id: registration.id } }).exec();
    if (existing) {
      const updated = await existing.atomicPatch({
        ...registration,
        updatedAt: new Date().toISOString()
      }).exec();
      return updated as EventRegistration;
    } else {
      const doc = await db.eventRegistrations.insert({
        ...registration,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return doc as EventRegistration;
    }
  },

  // Messages
  async queueMessage(
    db: PlatformDatabase,
    message: Omit<Message, '_rev' | '_attachments'>
  ): Promise<Message> {
    const doc = await db.messages.insert({
      ...message,
      status: 'queued',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return doc as Message;
  },

  async updateMessageStatus(
    db: PlatformDatabase,
    id: string,
    status: Message['status'],
    extra?: Partial<Message>
  ): Promise<void> {
    const doc = await db.messages.findOne({ selector: { id } }).exec();
    if (doc) {
      await doc.atomicPatch({
        status,
        ...extra,
        updatedAt: new Date().toISOString()
      }).exec();
    }
  }
};

export { replication } from './replication';
export { schema } from './schema';