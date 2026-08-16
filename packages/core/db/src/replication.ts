import { RxDatabase, RxCollection, ReplicationState } from 'rxdb';
import { PlatformDatabase } from './index';
import { COLLECTIONS } from './schema';

export interface ReplicationConfig {
  couchDBUrl: string;
  orgId: string;
  username?: string;
  password?: string;
  direction?: 'push' | 'pull' | 'both';
  live?: boolean;
  retryTime?: number;
  batchSize?: number;
  conflictHandler?: 'server-wins' | 'client-wins' | 'custom';
  customConflictHandler?: (conflict: any) => Promise<any>;
}

interface ReplicationStates {
  [collectionName: string]: ReplicationState<any, any>;
}

export interface SyncStatus {
  collection: string;
  state: 'stopped' | 'running' | 'error' | 'syncing';
  lastSync?: Date;
  error?: string;
  docsPending?: number;
}

let replicationStates: ReplicationStates = {};
let syncStatusCallbacks: ((status: SyncStatus[]) => void)[] = [];

export const replication = {
  async setupReplication(
    db: PlatformDatabase,
    config: ReplicationConfig
  ): Promise<void> {
    const baseUrl = config.couchDBUrl.replace(/\/$/, '');
    const auth = config.username && config.password
      ? `${config.username}:${config.password}@`
      : '';

    const collections = [
      { name: COLLECTIONS.people, conflictHandler: 'server-wins' },
      { name: COLLECTIONS.households, conflictHandler: 'server-wins' },
      { name: COLLECTIONS.transactions, conflictHandler: 'manual' },
      { name: COLLECTIONS.funds, conflictHandler: 'server-wins' },
      { name: COLLECTIONS.events, conflictHandler: 'server-wins' },
      { name: COLLECTIONS.eventRegistrations, conflictHandler: 'server-wins' },
      { name: COLLECTIONS.messages, conflictHandler: 'server-wins' },
      { name: COLLECTIONS.templates, conflictHandler: 'server-wins' },
      { name: COLLECTIONS.workflows, conflictHandler: 'server-wins' },
      { name: COLLECTIONS.workflowExecutions, conflictHandler: 'server-wins' },
      { name: COLLECTIONS.reports, conflictHandler: 'server-wins' },
      { name: COLLECTIONS.organizationSettings, conflictHandler: 'server-wins' }
    ];

    for (const { name, conflictHandler } of collections) {
      const collection = db[name as keyof PlatformDatabase] as RxCollection<any>;
      if (!collection) continue;

      const remoteUrl = `${baseUrl}/${config.orgId}_${name}`;

      try {
        const replicationState = await collection.syncCouchDB({
          remote: remoteUrl,
          direction: config.direction ?? 'both',
          live: config.live ?? true,
          retryTime: config.retryTime ?? 5000,
          batchSize: config.batchSize ?? 100,
          waitForLeadership: true,
          conflictHandler: getConflictHandler(conflictHandler, config.customConflictHandler)
        });

        replicationStates[name] = replicationState;
        setupReplicationListeners(name, replicationState);
      } catch (error) {
        console.error(`Failed to setup replication for ${name}:`, error);
        notifyStatusChange();
      }
    }
  },

  stopReplication(): void {
    for (const [name, state] of Object.entries(replicationStates)) {
      state.cancel();
    }
    replicationStates = {};
  },

  getReplicationState(collectionName: string): ReplicationState<any, any> | undefined {
    return replicationStates[collectionName];
  },

  getAllReplicationStates(): ReplicationStates {
    return { ...replicationStates };
  },

  getSyncStatus(): SyncStatus[] {
    return Object.entries(replicationStates).map(([collection, state]) => ({
      collection,
      state: getStateString(state),
      lastSync: getLastSyncTime(state),
      error: getError(state),
      docsPending: getPendingCount(state)
    }));
  },

  onSyncStatusChange(callback: (status: SyncStatus[]) => void): () => void {
    syncStatusCallbacks.push(callback);
    return () => {
      const index = syncStatusCallbacks.indexOf(callback);
      if (index > -1) syncStatusCallbacks.splice(index, 1);
    };
  },

  async triggerManualSync(db: PlatformDatabase): Promise<void> {
    for (const [name, state] of Object.entries(replicationStates)) {
      try {
        await state.awaitInitialReplication();
      } catch (error) {
        console.error(`Manual sync failed for ${name}:`, error);
      }
    }
  },

  async resolveConflict(
    collectionName: string,
    conflictId: string,
    resolution: 'server' | 'client' | 'custom',
    customData?: any
  ): Promise<void> {
    const state = replicationStates[collectionName];
    if (!state) throw new Error(`No replication state for ${collectionName}`);

    // RxDB handles conflict resolution through the handler
    // This is a placeholder for manual conflict resolution UI
    console.log(`Resolving conflict ${conflictId} in ${collectionName}:`, resolution);
  }
};

function getConflictHandler(
  type: 'server-wins' | 'client-wins' | 'manual' | 'custom',
  customHandler?: (conflict: any) => Promise<any>
) {
  switch (type) {
    case 'server-wins':
      return async (conflict: any) => {
        return conflict.serverDocument;
      };
    case 'client-wins':
      return async (conflict: any) => {
        return conflict.clientDocument;
      };
    case 'manual':
      return async (conflict: any) => {
        // Throw to indicate manual resolution needed
        throw new ConflictError(conflict);
      };
    case 'custom':
      return customHandler || (async (conflict: any) => conflict.serverDocument);
    default:
      return async (conflict: any) => conflict.serverDocument;
  }
}

function setupReplicationListeners(
  collectionName: string,
  state: ReplicationState<any, any>
): void {
  state.active$.subscribe(active => {
    if (!active) {
      console.log(`Replication stopped for ${collectionName}`);
    }
    notifyStatusChange();
  });

  state.error$.subscribe(error => {
    if (error) {
      console.error(`Replication error for ${collectionName}:`, error);
    }
    notifyStatusChange();
  });

  state.received$.subscribe(info => {
    console.log(`Received ${info.documents} docs for ${collectionName}`);
    notifyStatusChange();
  });

  state.send$.subscribe(info => {
    console.log(`Sent ${info.documents} docs for ${collectionName}`);
    notifyStatusChange();
  });

  state.docs$.subscribe(docs => {
    // Documents were replicated
    notifyStatusChange();
  });
}

function getStateString(state: ReplicationState<any, any>): SyncStatus['state'] {
  // Check if we can determine state from the observable
  // This is a simplified version - in reality you'd track this via subscriptions
  return 'running';
}

function getLastSyncTime(state: ReplicationState<any, any>): Date | undefined {
  // Would need to track this manually
  return undefined;
}

function getError(state: ReplicationState<any, any>): string | undefined {
  // Would need to track this via error$ subscription
  return undefined;
}

function getPendingCount(state: ReplicationState<any, any>): number | undefined {
  // Would need to track this manually
  return undefined;
}

function notifyStatusChange(): void {
  const status = replication.getSyncStatus();
  for (const callback of syncStatusCallbacks) {
    try {
      callback(status);
    } catch (error) {
      console.error('Sync status callback error:', error);
    }
  }
}

export class ConflictError extends Error {
  public conflict: any;

  constructor(conflict: any) {
    super(`Conflict in ${conflict.collection}: ${conflict.documentId}`);
    this.name = 'ConflictError';
    this.conflict = conflict;
  }
}

// ============================================
// Offline Mutation Queue (Outbox Pattern)
// ============================================

import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface MutationQueueSchema extends DBSchema {
  mutations: {
    key: string;
    value: {
      id: string;
      collection: string;
      operation: 'insert' | 'update' | 'delete';
      document: any;
      timestamp: number;
      retries: number;
      status: 'pending' | 'syncing' | 'failed' | 'conflict';
      error?: string;
    };
    indexes: { 'by-collection': string; 'by-status': string };
  };
}

let mutationQueueDb: IDBPDatabase<MutationQueueSchema> | null = null;

async function getMutationQueueDb(): Promise<IDBPDatabase<MutationQueueSchema>> {
  if (mutationQueueDb) return mutationQueueDb;

  mutationQueueDb = await openDB<MutationQueueSchema>('platform-mutation-queue', 1, {
    upgrade(db) {
      const store = db.createObjectStore('mutations', { keyPath: 'id' });
      store.createIndex('by-collection', 'collection');
      store.createIndex('by-status', 'status');
    }
  });

  return mutationQueueDb;
}

export const mutationQueue = {
  async enqueue(
    collection: string,
    operation: 'insert' | 'update' | 'delete',
    document: any
  ): Promise<string> {
    const db = await getMutationQueueDb();
    const id = crypto.randomUUID();
    const mutation = {
      id,
      collection,
      operation,
      document,
      timestamp: Date.now(),
      retries: 0,
      status: 'pending' as const
    };
    await db.put('mutations', mutation);
    return id;
  },

  async getPending(): Promise<Array<{
    id: string;
    collection: string;
    operation: 'insert' | 'update' | 'delete';
    document: any;
    timestamp: number;
    retries: number;
  }>> {
    const db = await getMutationQueueDb();
    return db.getAllFromIndex('mutations', 'by-status', 'pending');
  },

  async getByCollection(collection: string): Promise<Array<{
    id: string;
    collection: string;
    operation: 'insert' | 'update' | 'delete';
    document: any;
    timestamp: number;
    retries: number;
  }>> {
    const db = await getMutationQueueDb();
    return db.getAllFromIndex('mutations', 'by-collection', collection);
  },

  async markSyncing(id: string): Promise<void> {
    const db = await getMutationQueueDb();
    const mutation = await db.get('mutations', id);
    if (mutation) {
      mutation.status = 'syncing';
      await db.put('mutations', mutation);
    }
  },

  async markSuccess(id: string): Promise<void> {
    const db = await getMutationQueueDb();
    await db.delete('mutations', id);
  },

  async markFailed(id: string, error: string): Promise<void> {
    const db = await getMutationQueueDb();
    const mutation = await db.get('mutations', id);
    if (mutation) {
      mutation.status = 'failed';
      mutation.error = error;
      mutation.retries += 1;
      if (mutation.retries >= 5) {
        mutation.status = 'failed';
      } else {
        mutation.status = 'pending';
      }
      await db.put('mutations', mutation);
    }
  },

  async markConflict(id: string, error: string): Promise<void> {
    const db = await getMutationQueueDb();
    const mutation = await db.get('mutations', id);
    if (mutation) {
      mutation.status = 'conflict';
      mutation.error = error;
      await db.put('mutations', mutation);
    }
  },

  async replay(db: PlatformDatabase): Promise<{ success: number; failed: number; conflicts: number }> {
    const pending = await this.getPending();
    let success = 0;
    let failed = 0;
    let conflicts = 0;

    for (const mutation of pending) {
      await this.markSyncing(mutation.id);
      try {
        const collection = db[mutation.collection as keyof PlatformDatabase] as RxCollection<any>;
        if (!collection) {
          throw new Error(`Collection ${mutation.collection} not found`);
        }

        switch (mutation.operation) {
          case 'insert':
            await collection.insert(mutation.document);
            break;
          case 'update':
            const existing = await collection.findOne({ selector: { id: mutation.document.id } }).exec();
            if (existing) {
              await existing.atomicPatch(mutation.document).exec();
            } else {
              await collection.insert(mutation.document);
            }
            break;
          case 'delete':
            const toDelete = await collection.findOne({ selector: { id: mutation.document.id } }).exec();
            if (toDelete) {
              await toDelete.remove();
            }
            break;
        }

        await this.markSuccess(mutation.id);
        success++;
      } catch (error: any) {
        if (error.name === 'ConflictError' || error.message?.includes('conflict')) {
          await this.markConflict(mutation.id, error.message);
          conflicts++;
        } else {
          await this.markFailed(mutation.id, error.message);
          failed++;
        }
      }
    }

    return { success, failed, conflicts };
  },

  async clear(): Promise<void> {
    const db = await getMutationQueueDb();
    await db.clear('mutations');
  },

  async getStats(): Promise<{ pending: number; failed: number; conflicts: number }> {
    const db = await getMutationQueueDb();
    const all = await db.getAll('mutations');
    return {
      pending: all.filter(m => m.status === 'pending').length,
      failed: all.filter(m => m.status === 'failed').length,
      conflicts: all.filter(m => m.status === 'conflict').length
    };
  }
};

// ============================================
// Service Worker Registration (for PWA)
// ============================================

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New version available
              console.log('New version available, please refresh');
              // Could dispatch custom event for UI notification
              window.dispatchEvent(new CustomEvent('sw-update-available'));
            }
          });
        }
      });

      // Handle background sync
      if ('sync' in registration) {
        console.log('Background Sync supported');
      }

      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
  return null;
}

export async function requestBackgroundSync(tag: string): Promise<void> {
  if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
    const registration = await navigator.serviceWorker.ready;
    await (registration as any).sync.register(tag);
  }
}

export async function requestPeriodicBackgroundSync(tag: string, minInterval: number): Promise<void> {
  if ('serviceWorker' in navigator && 'periodicSync' in window.ServiceWorkerRegistration.prototype) {
    const registration = await navigator.serviceWorker.ready;
    try {
      await (registration as any).periodicSync.register(tag, { minInterval });
    } catch (error) {
      console.log('Periodic background sync not available:', error);
    }
  }
}