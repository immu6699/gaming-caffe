import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  GamingStation,
  LiveSession,
  Booking,
  Customer,
  Invoice,
  PricingRule,
  StaffMember,
  MenuItem,
  FnbOrder,
  StockItem,
  Branch,
} from '../types';

// Environment-based API URL configuration
const BASE_URL = (import.meta as any).env?.VITE_API_URL || '/api/v1';

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT auth tokens & tenant/branch headers
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('qhar_auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const branchId = localStorage.getItem('qhar_active_branch_id');
    if (branchId && config.headers) {
      config.headers['X-Branch-ID'] = branchId;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for consistent error handling and 401 redirection
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Session expired or unauthorized. Redirecting to login.');
    }
    return Promise.reject(error);
  }
);

// Typed API endpoints designed for real backend integration
export const api = {
  // Branches
  branches: {
    getAll: () => apiClient.get<Branch[]>('/branches'),
    getById: (id: string) => apiClient.get<Branch>(`/branches/${id}`),
    create: (data: Partial<Branch>) => apiClient.post<Branch>('/branches', data),
    update: (id: string, data: Partial<Branch>) => apiClient.put<Branch>(`/branches/${id}`, data),
  },

  // Stations
  stations: {
    getAll: (params?: { branchId?: string; status?: string; type?: string }) =>
      apiClient.get<GamingStation[]>('/stations', { params }),
    getById: (id: string) => apiClient.get<GamingStation>(`/stations/${id}`),
    create: (data: Partial<GamingStation>) => apiClient.post<GamingStation>('/stations', data),
    update: (id: string, data: Partial<GamingStation>) => apiClient.put<GamingStation>(`/stations/${id}`, data),
    delete: (id: string) => apiClient.delete(`/stations/${id}`),
  },

  // Live Sessions
  sessions: {
    getAll: (params?: { branchId?: string; status?: string }) =>
      apiClient.get<LiveSession[]>('/sessions', { params }),
    start: (data: { stationId: string; customerName: string; customerPhone?: string; durationHours: number }) =>
      apiClient.post<LiveSession>('/sessions/start', data),
    extend: (id: string, minutes: number) =>
      apiClient.post<LiveSession>(`/sessions/${id}/extend`, { minutes }),
    end: (id: string, paymentMethod?: string) =>
      apiClient.post<{ session: LiveSession; invoice: Invoice }>(`/sessions/${id}/end`, { paymentMethod }),
  },

  // Bookings
  bookings: {
    getAll: (params?: { branchId?: string; date?: string; status?: string }) =>
      apiClient.get<Booking[]>('/bookings', { params }),
    create: (data: Partial<Booking>) => apiClient.post<Booking>('/bookings', data),
    update: (id: string, data: Partial<Booking>) => apiClient.put<Booking>(`/bookings/${id}`, data),
    cancel: (id: string, reason: string) => apiClient.post<Booking>(`/bookings/${id}/cancel`, { reason }),
  },

  // Customers
  customers: {
    getAll: (params?: { query?: string }) => apiClient.get<Customer[]>('/customers', { params }),
    getById: (id: string) => apiClient.get<Customer>(`/customers/${id}`),
    create: (data: Partial<Customer>) => apiClient.post<Customer>('/customers', data),
    update: (id: string, data: Partial<Customer>) => apiClient.put<Customer>(`/customers/${id}`, data),
  },

  // Invoices & Billing
  billing: {
    getInvoices: (params?: { branchId?: string; status?: string }) =>
      apiClient.get<Invoice[]>('/billing/invoices', { params }),
    recordPayment: (id: string, paymentData: { amount: number; method: string; transactionRef?: string }) =>
      apiClient.post<Invoice>(`/billing/invoices/${id}/pay`, paymentData),
    refund: (id: string, reason: string) =>
      apiClient.post<Invoice>(`/billing/invoices/${id}/refund`, { reason }),
  },

  // Pricing Rules
  pricing: {
    getAll: () => apiClient.get<PricingRule[]>('/pricing'),
    update: (id: string, data: Partial<PricingRule>) => apiClient.put<PricingRule>(`/pricing/${id}`, data),
  },

  // Staff & Roles
  staff: {
    getAll: () => apiClient.get<StaffMember[]>('/staff'),
    create: (data: Partial<StaffMember>) => apiClient.post<StaffMember>('/staff', data),
    update: (id: string, data: Partial<StaffMember>) => apiClient.put<StaffMember>(`/staff/${id}`, data),
  },

  // Food & Beverages (F&B)
  fnb: {
    getMenuItems: (params?: { category?: string; branchId?: string }) =>
      apiClient.get<MenuItem[]>('/fnb/menu', { params }),
    createMenuItem: (data: Partial<MenuItem>) => apiClient.post<MenuItem>('/fnb/menu', data),
    updateMenuItem: (id: string, data: Partial<MenuItem>) => apiClient.put<MenuItem>(`/fnb/menu/${id}`, data),
    
    getOrders: (params?: { status?: string; branchId?: string }) =>
      apiClient.get<FnbOrder[]>('/fnb/orders', { params }),
    createOrder: (data: Partial<FnbOrder>) => apiClient.post<FnbOrder>('/fnb/orders', data),
    updateOrderStatus: (id: string, status: FnbOrder['orderStatus'], reason?: string) =>
      apiClient.put<FnbOrder>(`/fnb/orders/${id}/status`, { status, reason }),

    getInventory: (branchId?: string) => apiClient.get<StockItem[]>('/fnb/inventory', { params: { branchId } }),
    adjustStock: (id: string, data: { quantityChange: number; reason: string }) =>
      apiClient.post<StockItem>(`/fnb/inventory/${id}/adjust`, data),
  },
};
