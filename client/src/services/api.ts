const API_BASE = '/api/v1';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;

  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // Retrieve token from localStorage if stored as fallback
  const token = localStorage.getItem('lotus_token');
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Include HTTP-only cookie
  });

  if (response.status === 401 && !endpoint.includes('/auth/login')) {
    localStorage.removeItem('lotus_token');
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    const error: any = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Authentication
  login: (credentials: { email: string; password: string }) =>
    request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  logout: () =>
    request<any>('/auth/logout', {
      method: 'POST',
    }),
  getCurrentUser: () => request<any>('/auth/me'),

  // Public Products
  getPublicProducts: (params?: {
    category?: string;
    search?: string;
    grade?: string;
    material?: string;
    finish?: string;
    industry?: string;
    page?: number;
    limit?: number;
  }) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.set(key, String(val));
        }
      });
    }
    return request<any>(`/products/public?${query.toString()}`);
  },
  getPriorityProducts: () => request<any>('/products/public/priority'),
  getProductBySlug: (slug: string) => request<any>(`/products/public/${slug}`),
  getCategories: () => request<any>('/products/public/categories'),

  // Public RFQ / Enquiry & BOQ
  submitEnquiry: (enquiryData: any) =>
    request<any>('/enquiries/public', {
      method: 'POST',
      body: JSON.stringify(enquiryData),
    }),
  uploadBoqFile: (data: { originalName: string; mimeType: string; base64Data: string; category?: string; enquiryRef?: string }) =>
    request<any>('/uploads/boq', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // CRM Products
  getAdminProducts: (params?: { category?: string; search?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== '') query.set(key, String(val));
      });
    }
    return request<any>(`/products/admin?${query.toString()}`);
  },
  createProduct: (data: any) =>
    request<any>('/products/admin', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateProduct: (id: string, data: any) =>
    request<any>(`/products/admin/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deleteProduct: (id: string) =>
    request<any>(`/products/admin/${id}`, {
      method: 'DELETE',
    }),

  // CRM Enquiries
  getEnquiries: (params?: any) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== '' && val !== 'all') {
          query.set(key, String(val));
        }
      });
    }
    return request<any>(`/enquiries?${query.toString()}`);
  },
  getEnquiryById: (id: string) => request<any>(`/enquiries/${id}`),
  updateEnquiryStatus: (id: string, data: { status: string; notes?: string; lossReason?: string }) =>
    request<any>(`/enquiries/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  assignEnquiry: (id: string, data: { assignedUserId: string; notes?: string }) =>
    request<any>(`/enquiries/${id}/assign`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  addEnquiryNote: (id: string, note: string) =>
    request<any>(`/enquiries/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify({ note }),
    }),

  // CRM Quotation Management
  getQuotations: (params?: { status?: string; search?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== '' && val !== 'all') query.set(key, String(val));
      });
    }
    return request<any>(`/quotations?${query.toString()}`);
  },
  getQuotationById: (id: string) => request<any>(`/quotations/${id}`),
  createQuotation: (data: any) =>
    request<any>('/quotations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateQuotationStatus: (id: string, data: { status: string; notes?: string }) =>
    request<any>(`/quotations/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // CRM Tasks & Follow-ups
  getTasks: (params?: { status?: string; priority?: string; assignedUser?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== '' && val !== 'all') query.set(key, String(val));
      });
    }
    return request<any>(`/tasks?${query.toString()}`);
  },
  createTask: (data: any) =>
    request<any>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateTask: (id: string, data: any) =>
    request<any>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // CRM Customers
  getCustomers: (params?: { search?: string; country?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== '') query.set(key, String(val));
      });
    }
    return request<any>(`/customers?${query.toString()}`);
  },
  getCustomerById: (id: string) => request<any>(`/customers/${id}`),
  updateCustomer: (id: string, data: any) =>
    request<any>(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // CRM Follow-ups (Legacy mapping)
  getFollowUps: (params?: { filter?: string; page?: number }) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== '') query.set(key, String(val));
      });
    }
    return request<any>(`/follow-ups?${query.toString()}`);
  },
  createFollowUp: (enquiryId: string, data: any) =>
    request<any>(`/follow-ups/enquiry/${enquiryId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  completeFollowUp: (id: string, completionNotes?: string) =>
    request<any>(`/follow-ups/${id}/complete`, {
      method: 'PATCH',
      body: JSON.stringify({ completionNotes }),
    }),

  // CRM Communications
  getEnquiryCommunications: (enquiryId: string) =>
    request<any>(`/communications/enquiry/${enquiryId}`),
  createCommunicationLog: (enquiryId: string, data: any) =>
    request<any>(`/communications/enquiry/${enquiryId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // CRM Reports & Overview
  getDashboardOverview: () => request<any>('/reports/overview'),
  getReportsAnalytics: (params?: { startDate?: string; endDate?: string }) => {
    const query = new URLSearchParams();
    if (params?.startDate) query.set('startDate', params.startDate);
    if (params?.endDate) query.set('endDate', params.endDate);
    return request<any>(`/reports/analytics?${query.toString()}`);
  },
  getExportCSVUrl: (status?: string, country?: string) => {
    const query = new URLSearchParams();
    if (status && status !== 'all') query.set('status', status);
    if (country && country !== 'all') query.set('country', country);
    return `${API_BASE}/reports/export-csv?${query.toString()}`;
  },

  // CRM User Management (Super Admin)
  getUsers: () => request<any>('/users'),
  createUser: (userData: any) =>
    request<any>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  toggleUserStatus: (id: string) =>
    request<any>(`/users/${id}/toggle-status`, {
      method: 'PATCH',
    }),
  updateUserRole: (id: string, role: string) =>
    request<any>(`/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    }),
  resetUserPassword: (id: string, newPassword: string) =>
    request<any>(`/users/${id}/reset-password`, {
      method: 'PATCH',
      body: JSON.stringify({ newPassword }),
    }),

  // Company Settings & Public Brand
  getCompanySettings: () => request<any>('/settings'),
  getPublicCompanySettings: () => request<any>('/settings/public'),
  updateCompanySettings: (data: any) =>
    request<any>('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // WhatsApp Integration & Audit Logs
  getWhatsAppStatus: () => request<any>('/integrations/whatsapp/status'),
  getAuditLogs: (params?: { action?: string; entityType?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== '' && val !== 'all') query.set(key, String(val));
      });
    }
    return request<any>(`/audit-logs?${query.toString()}`);
  },
};
