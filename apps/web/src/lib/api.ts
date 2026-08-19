import { useAuth } from '@clerk/clerk-react';

const API_BASE = '/api';

class ApiClient {
  private baseUrl: string;
  private getTokenFn: (() => Promise<string | null>) | null = null;

  constructor(baseUrl: string = API_BASE) {
    this.baseUrl = baseUrl;
  }

  setTokenGetter(getToken: () => Promise<string | null>) {
    this.getTokenFn = getToken;
  }

  private async getHeaders(): Promise<HeadersInit> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (this.getTokenFn) {
      try {
        const token = await this.getTokenFn();
        if (token) {
          (headers as Record<string, string>).Authorization = `Bearer ${token}`;
        }
      } catch {
        // Token retrieval failed - request will proceed without auth
      }
    }
    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  // People
  async getPeople(params?: { page?: number; limit?: number; search?: string; status?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.search) searchParams.set('search', params.search);
    if (params?.status) searchParams.set('status', params.status);
    return this.request(`/people?${searchParams}`);
  }

  async getPerson(id: string) {
    return this.request(`/people/${id}`);
  }

  async createPerson(data: Record<string, unknown>) {
    return this.request('/people', { method: 'POST', body: JSON.stringify(data) });
  }

  async updatePerson(id: string, data: Record<string, unknown>) {
    return this.request(`/people/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
  }

  async deletePerson(id: string) {
    return this.request(`/people/${id}`, { method: 'DELETE' });
  }

  // Households
  async getHouseholds(params?: { page?: number; limit?: number }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    return this.request(`/households?${searchParams}`);
  }

  async createHousehold(data: Record<string, unknown>) {
    return this.request('/households', { method: 'POST', body: JSON.stringify(data) });
  }

  // Transactions
  async getTransactions(params?: { page?: number; limit?: number; fundId?: string; startDate?: string; endDate?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.fundId) searchParams.set('fundId', params.fundId);
    if (params?.startDate) searchParams.set('startDate', params.startDate);
    if (params?.endDate) searchParams.set('endDate', params.endDate);
    return this.request(`/transactions?${searchParams}`);
  }

  async createTransaction(data: Record<string, unknown>) {
    return this.request('/transactions', { method: 'POST', body: JSON.stringify(data) });
  }

  async reconcileTransaction(id: string) {
    return this.request(`/transactions/${id}/reconcile`, { method: 'POST' });
  }

  // Funds
  async getFunds() {
    return this.request('/funds');
  }

  async createFund(data: Record<string, unknown>) {
    return this.request('/funds', { method: 'POST', body: JSON.stringify(data) });
  }

  // Events
  async getEvents(params?: { page?: number; limit?: number; startDate?: string; endDate?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.startDate) searchParams.set('startDate', params.startDate);
    if (params?.endDate) searchParams.set('endDate', params.endDate);
    return this.request(`/events?${searchParams}`);
  }

  async getEvent(id: string) {
    return this.request(`/events/${id}`);
  }

  async createEvent(data: Record<string, unknown>) {
    return this.request('/events', { method: 'POST', body: JSON.stringify(data) });
  }

  // Registrations
  async getRegistrations(eventId: string) {
    return this.request(`/events/${eventId}/registrations`);
  }

  async createRegistration(eventId: string, data: Record<string, unknown>) {
    return this.request(`/events/${eventId}/registrations`, { method: 'POST', body: JSON.stringify(data) });
  }

  // Check-in
  async checkIn(eventId: string, personId: string, roomId?: string) {
    return this.request(`/events/${eventId}/checkin`, {
      method: 'POST',
      body: JSON.stringify({ personId, roomId })
    });
  }

  // Volunteers
  async getShifts(params?: { eventId?: string; date?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.eventId) searchParams.set('eventId', params.eventId);
    if (params?.date) searchParams.set('date', params.date);
    return this.request(`/shifts?${searchParams}`);
  }

  async createShift(data: Record<string, unknown>) {
    return this.request('/shifts', { method: 'POST', body: JSON.stringify(data) });
  }

  async confirmShift(shiftId: string, personId: string) {
    return this.request(`/shifts/${shiftId}/confirm`, {
      method: 'POST',
      body: JSON.stringify({ personId })
    });
  }

  // Messages
  async sendMessage(data: Record<string, unknown>) {
    return this.request('/messages', { method: 'POST', body: JSON.stringify(data) });
  }

  async getTemplates() {
    return this.request('/templates');
  }

  async createTemplate(data: Record<string, unknown>) {
    return this.request('/templates', { method: 'POST', body: JSON.stringify(data) });
  }

  // Reports
  async getReports() {
    return this.request('/reports');
  }

  async generateReport(id: string, params?: Record<string, unknown>) {
    return this.request(`/reports/${id}/generate`, { method: 'POST', body: JSON.stringify(params) });
  }

  // Settings
  async getSettings() {
    return this.request('/settings');
  }

  async updateSettings(data: Record<string, unknown>) {
    return this.request('/settings', { method: 'PATCH', body: JSON.stringify(data) });
  }

  // File upload
  async uploadFile(file: File, type: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const headers: HeadersInit = {};
    if (this.getTokenFn) {
      try {
        const token = await this.getTokenFn();
        if (token) {
          (headers as Record<string, string>).Authorization = `Bearer ${token}`;
        }
      } catch {
        // Token retrieval failed
      }
    }
    const response = await fetch(`${this.baseUrl}/files`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return response.json();
  }
}

export const api = new ApiClient();

// Hook to initialize the API client with Clerk token
export function useApiClient() {
  const { getToken } = useAuth();

  // Set the token getter on the api client
  api.setTokenGetter(getToken);

  return api;
}

// React Query hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function usePeople(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['people', params],
    queryFn: () => api.getPeople(params as { page?: number; limit?: number; search?: string; status?: string }),
  });
}

export function usePerson(id: string) {
  return useQuery({
    queryKey: ['person', id],
    queryFn: () => api.getPerson(id),
    enabled: !!id,
  });
}

export function useCreatePerson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => api.createPerson(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['people'] });
    },
  });
}

export function useUpdatePerson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => api.updatePerson(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['people'] });
      queryClient.invalidateQueries({ queryKey: ['person', id] });
    },
  });
}

export function useTransactions(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['transactions', params],
    queryFn: () => api.getTransactions(params as { page?: number; limit?: number; fundId?: string; startDate?: string; endDate?: string }),
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => api.createTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['funds'] });
    },
  });
}

export function useFunds() {
  return useQuery({
    queryKey: ['funds'],
    queryFn: api.getFunds,
  });
}

export function useEvents(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['events', params],
    queryFn: () => api.getEvents(params as { page?: number; limit?: number; startDate?: string; endDate?: string }),
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: ['event', id],
    queryFn: () => api.getEvent(id),
    enabled: !!id,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => api.createEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

export function useRegistrations(eventId: string) {
  return useQuery({
    queryKey: ['registrations', eventId],
    queryFn: () => api.getRegistrations(eventId),
    enabled: !!eventId,
  });
}

export function useCreateRegistration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ eventId, data }: { eventId: string; data: Record<string, unknown> }) => api.createRegistration(eventId, data),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ['registrations', eventId] });
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
    },
  });
}

export function useCheckIn() {
  return useMutation({
    mutationFn: ({ eventId, personId, roomId }: { eventId: string; personId: string; roomId?: string }) =>
      api.checkIn(eventId, personId, roomId),
  });
}

export function useShifts(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['shifts', params],
    queryFn: () => api.getShifts(params as { eventId?: string; date?: string }),
  });
}

export function useMessages() {
  return useQuery({
    queryKey: ['messages'],
    queryFn: () => api.getTemplates(),
  });
}

export function useReports() {
  return useQuery({
    queryKey: ['reports'],
    queryFn: api.getReports,
  });
}

export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: api.getSettings,
  });
}
