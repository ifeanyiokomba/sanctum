import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Person, Transaction, Event, EventRegistration, Message, Template, Workflow, Report, Fund, Household } from '@/core/db';

// UI State
interface UIState {
  sidebarCollapsed: boolean;
  sidebarMobileOpen: boolean;
  theme: 'light' | 'dark';
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSidebarMobileOpen: (open: boolean) => void;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      sidebarMobileOpen: false,
      theme: 'light',
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setSidebarMobileOpen: (open) => set({ sidebarMobileOpen: open }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'platform-ui',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Data State (for optimistic updates)
interface DataState {
  people: Person[];
  households: Household[];
  transactions: Transaction[];
  funds: Fund[];
  events: Event[];
  registrations: EventRegistration[];
  messages: Message[];
  templates: Template[];
  workflows: Workflow[];
  reports: Report[];

  // Optimistic mutations
  addPerson: (person: Person) => void;
  updatePerson: (id: string, data: Partial<Person>) => void;
  deletePerson: (id: string) => void;
  addHousehold: (household: Household) => void;
  updateHousehold: (id: string, data: Partial<Household>) => void;
  deleteHousehold: (id: string) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, data: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addFund: (fund: Fund) => void;
  updateFund: (id: string, data: Partial<Fund>) => void;
  deleteFund: (id: string) => void;
  addEvent: (event: Event) => void;
  updateEvent: (id: string, data: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  addRegistration: (registration: EventRegistration) => void;
  updateRegistration: (id: string, data: Partial<EventRegistration>) => void;
  deleteRegistration: (id: string) => void;
}

export const useDataStore = create<DataState>((set) => ({
  people: [],
  households: [],
  transactions: [],
  funds: [],
  events: [],
  registrations: [],
  messages: [],
  templates: [],
  workflows: [],
  reports: [],

  addPerson: (person) => set((state) => ({ people: [...state.people, person] })),
  updatePerson: (id, data) => set((state) => ({
    people: state.people.map((p) => (p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p))
  })),
  deletePerson: (id) => set((state) => ({ people: state.people.filter((p) => p.id !== id) })),

  addHousehold: (household) => set((state) => ({ households: [...state.households, household] })),
  updateHousehold: (id, data) => set((state) => ({
    households: state.households.map((h) => (h.id === id ? { ...h, ...data, updatedAt: new Date().toISOString() } : h))
  })),
  deleteHousehold: (id) => set((state) => ({ households: state.households.filter((h) => h.id !== id) })),

  addTransaction: (transaction) => set((state) => ({ transactions: [...state.transactions, transaction] })),
  updateTransaction: (id, data) => set((state) => ({
    transactions: state.transactions.map((t) => (t.id === id ? { ...t, ...data, updatedAt: new Date().toISOString() } : t))
  })),
  deleteTransaction: (id) => set((state) => ({ transactions: state.transactions.filter((t) => t.id !== id) })),

  addFund: (fund) => set((state) => ({ funds: [...state.funds, fund] })),
  updateFund: (id, data) => set((state) => ({
    funds: state.funds.map((f) => (f.id === id ? { ...f, ...data, updatedAt: new Date().toISOString() } : f))
  })),
  deleteFund: (id) => set((state) => ({ funds: state.funds.filter((f) => f.id !== id) })),

  addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
  updateEvent: (id, data) => set((state) => ({
    events: state.events.map((e) => (e.id === id ? { ...e, ...data, updatedAt: new Date().toISOString() } : e))
  })),
  deleteEvent: (id) => set((state) => ({ events: state.events.filter((e) => e.id !== id) })),

  addRegistration: (registration) => set((state) => ({ registrations: [...state.registrations, registration] })),
  updateRegistration: (id, data) => set((state) => ({
    registrations: state.registrations.map((r) => (r.id === id ? { ...r, ...data, updatedAt: new Date().toISOString() } : r))
  })),
  deleteRegistration: (id) => set((state) => ({ registrations: state.registrations.filter((r) => r.id !== id) })),
}));

// Notification State
interface NotificationState {
  toasts: Array<{ id: string; type: 'success' | 'error' | 'warning' | 'info'; title: string; message?: string }>;
  addToast: (toast: Omit<NotificationState['toasts'][0], 'id'>) => string;
  removeToast: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    return id;
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

// Sync State
interface SyncState {
  isOnline: boolean;
  lastSync: Date | null;
  pendingCount: number;
  syncStatus: 'idle' | 'syncing' | 'error' | 'success';
  setOnline: (online: boolean) => void;
  setLastSync: (date: Date) => void;
  setPendingCount: (count: number) => void;
  setSyncStatus: (status: SyncState['syncStatus']) => void;
}

export const useSyncStore = create<SyncState>((set) => ({
  isOnline: true,
  lastSync: null,
  pendingCount: 0,
  syncStatus: 'idle',
  setOnline: (online) => set({ isOnline: online }),
  setLastSync: (date) => set({ lastSync: date }),
  setPendingCount: (count) => set({ pendingCount: count }),
  setSyncStatus: (status) => set({ syncStatus: status }),
}));