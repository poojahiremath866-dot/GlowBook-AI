import {
  User,
  Parlor,
  Service,
  Beautician,
  BeautyPackage,
  Offer,
  Appointment,
  Review,
  AIRecommendation,
  StyleAnalysisResult
} from '../types';

export const api = {
  // Auth
  async login(email: string, password?: string, role?: string): Promise<{ success: boolean; token: string; user: User }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role }),
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
  },

  async register(data: { name: string; email: string; role: string; phone?: string; city?: string }): Promise<{ success: boolean; token: string; user: User }> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Registration failed');
    return result;
  },

  async getMe(userId?: string): Promise<{ user: User }> {
    const res = await fetch('/api/auth/me', {
      headers: { 'x-user-id': userId || 'usr-1' }
    });
    return res.json();
  },

  // Parlors
  async getParlors(params?: {
    city?: string;
    category?: string;
    minRating?: number;
    maxPrice?: number;
    search?: string;
    type?: string;
    verifiedOnly?: boolean;
  }): Promise<{ parlors: Parlor[]; count: number }> {
    const searchParams = new URLSearchParams();
    if (params?.city) searchParams.append('city', params.city);
    if (params?.category) searchParams.append('category', params.category);
    if (params?.minRating) searchParams.append('minRating', params.minRating.toString());
    if (params?.maxPrice) searchParams.append('maxPrice', params.maxPrice.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.type) searchParams.append('type', params.type);
    if (params?.verifiedOnly) searchParams.append('verifiedOnly', 'true');

    const res = await fetch(`/api/parlors?${searchParams.toString()}`);
    return res.json();
  },

  async getParlorById(id: string): Promise<{
    parlor: Parlor;
    services: Service[];
    beauticians: Beautician[];
    reviews: Review[];
    packages: BeautyPackage[];
  }> {
    const res = await fetch(`/api/parlors/${id}`);
    if (!res.ok) throw new Error('Parlor not found');
    return res.json();
  },

  async createParlor(data: Partial<Parlor>): Promise<{ success: boolean; parlor: Parlor }> {
    const res = await fetch('/api/parlors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateParlor(id: string, data: Partial<Parlor>): Promise<{ success: boolean; parlor: Parlor }> {
    const res = await fetch(`/api/parlors/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Services
  async getServices(params?: {
    category?: string;
    search?: string;
    maxPrice?: number;
    popularOnly?: boolean;
  }): Promise<{ services: Service[]; count: number }> {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append('category', params.category);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.maxPrice) searchParams.append('maxPrice', params.maxPrice.toString());
    if (params?.popularOnly) searchParams.append('popularOnly', 'true');

    const res = await fetch(`/api/services?${searchParams.toString()}`);
    return res.json();
  },

  async createService(data: Partial<Service>): Promise<{ success: boolean; service: Service }> {
    const res = await fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateService(id: string, data: Partial<Service>): Promise<{ success: boolean; service: Service }> {
    const res = await fetch(`/api/services/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteService(id: string): Promise<{ success: boolean; service: Service }> {
    const res = await fetch(`/api/services/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  // Beauticians
  async getBeauticians(params?: { parlorId?: string; specialization?: string }): Promise<{ beauticians: Beautician[]; count: number }> {
    const searchParams = new URLSearchParams();
    if (params?.parlorId) searchParams.append('parlorId', params.parlorId);
    if (params?.specialization) searchParams.append('specialization', params.specialization);

    const res = await fetch(`/api/beauticians?${searchParams.toString()}`);
    return res.json();
  },

  async createBeautician(data: Partial<Beautician>): Promise<{ success: boolean; beautician: Beautician }> {
    const res = await fetch('/api/beauticians', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Packages & Offers
  async getPackages(occasion?: string): Promise<{ packages: BeautyPackage[] }> {
    const searchParams = new URLSearchParams();
    if (occasion) searchParams.append('occasion', occasion);
    const res = await fetch(`/api/packages?${searchParams.toString()}`);
    return res.json();
  },

  async getOffers(): Promise<{ offers: Offer[] }> {
    const res = await fetch('/api/offers');
    return res.json();
  },

  // Slots & Double-booking check
  async getAvailableSlots(params: { beauticianId: string; date: string; parlorId?: string }): Promise<{
    date: string;
    beauticianId: string;
    slots: { time: string; available: boolean; reason: string }[];
  }> {
    const searchParams = new URLSearchParams();
    searchParams.append('beauticianId', params.beauticianId);
    searchParams.append('date', params.date);
    if (params.parlorId) searchParams.append('parlorId', params.parlorId);

    const res = await fetch(`/api/slots/available?${searchParams.toString()}`);
    return res.json();
  },

  // Appointments
  async getAppointments(userId?: string, parlorId?: string, status?: string): Promise<{ appointments: Appointment[]; count: number }> {
    const searchParams = new URLSearchParams();
    if (parlorId) searchParams.append('parlorId', parlorId);
    if (status) searchParams.append('status', status);

    const headers: Record<string, string> = {};
    if (userId) headers['x-user-id'] = userId;

    const res = await fetch(`/api/appointments?${searchParams.toString()}`, { headers });
    return res.json();
  },

  async createAppointment(data: Partial<Appointment>): Promise<{ success: boolean; message: string; appointment: Appointment }> {
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to book appointment');
    return result;
  },

  async updateAppointmentStatus(id: string, update: { status?: string; date?: string; time?: string }): Promise<{ success: boolean; appointment: Appointment }> {
    const res = await fetch(`/api/appointments/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update),
    });
    return res.json();
  },

  // Payments Test Simulator
  async checkout(data: { amount: number; currency?: string; gateway?: 'razorpay' | 'stripe' }): Promise<{
    success: boolean;
    orderId: string;
    amount: number;
    currency: string;
    key: string;
    gateway: string;
  }> {
    const res = await fetch('/api/payments/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async verifyPayment(paymentId: string, orderId: string): Promise<{ success: boolean; verified: boolean; message: string }> {
    const res = await fetch('/api/payments/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId, orderId }),
    });
    return res.json();
  },

  // Reviews
  async getReviews(parlorId?: string): Promise<{ reviews: Review[]; count: number }> {
    const searchParams = new URLSearchParams();
    if (parlorId) searchParams.append('parlorId', parlorId);
    const res = await fetch(`/api/reviews?${searchParams.toString()}`);
    return res.json();
  },

  async createReview(data: Partial<Review> & { appointmentId?: string }): Promise<{ success: boolean; review: Review }> {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Wishlist
  async getWishlist(userId?: string): Promise<{ wishlist: { userId: string; itemId: string; itemType: string }[] }> {
    const res = await fetch('/api/wishlist', {
      headers: { 'x-user-id': userId || 'usr-1' }
    });
    return res.json();
  },

  async toggleWishlist(itemId: string, itemType: string, userId?: string): Promise<{ success: boolean; isSaved: boolean; wishlist: any[] }> {
    const res = await fetch('/api/wishlist/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId, itemType, userId: userId || 'usr-1' }),
    });
    return res.json();
  },

  // AI Services
  async getAiConsultation(params: {
    userInput?: string;
    occasion?: string;
    budget?: number;
    preferredStyle?: string;
    availableTime?: string;
    targetDate?: string;
    city?: string;
  }): Promise<{ success: boolean; recommendation: AIRecommendation }> {
    const res = await fetch('/api/ai/consultant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Consultation failed');
    return data;
  },

  async buildAiPackage(params: {
    occasion: string;
    budget: number;
    availableTime?: string;
    desiredServices?: string[];
    preferredStyle?: string;
    preferredDate?: string;
  }): Promise<{ success: boolean; package: AIRecommendation }> {
    const res = await fetch('/api/ai/package-builder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return res.json();
  },

  async sendGlowBotChat(messages: { sender: 'user' | 'bot'; text: string }[]): Promise<{
    success: boolean;
    reply: string;
    quickActions: { label: string; action: string; payload?: any }[];
  }> {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });
    return res.json();
  },

  async getAiStyleRecommendation(params: {
    textPrompt?: string;
    imageBase64?: string;
    imageMimeType?: string;
    occasion?: string;
    preferredTone?: string;
  }): Promise<{ success: boolean; result: StyleAnalysisResult }> {
    const res = await fetch('/api/ai/style-recommendation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return res.json();
  },

  // Analytics
  async getAdminStats(): Promise<any> {
    const res = await fetch('/api/admin/stats');
    return res.json();
  },

  async getOwnerStats(parlorId?: string): Promise<any> {
    const searchParams = new URLSearchParams();
    if (parlorId) searchParams.append('parlorId', parlorId);
    const res = await fetch(`/api/owner/stats?${searchParams.toString()}`);
    return res.json();
  },

  // Supabase Database Integration
  async getSupabaseStatus(): Promise<{
    connected: boolean;
    projectId: string;
    url: string;
    tablesFound: string[];
    message: string;
    error?: string;
  }> {
    const res = await fetch('/api/supabase/status');
    return res.json();
  },

  async testSupabaseConnection(): Promise<{
    connected: boolean;
    projectId: string;
    url: string;
    tablesFound: string[];
    message: string;
    error?: string;
  }> {
    const res = await fetch('/api/supabase/test', { method: 'POST' });
    return res.json();
  },

  async getSupabaseSchema(): Promise<{ projectId: string; url: string; schema: string }> {
    const res = await fetch('/api/supabase/schema');
    return res.json();
  },

  async syncSupabaseSeed(): Promise<{ success: boolean; message: string; results: Record<string, any> }> {
    const res = await fetch('/api/supabase/seed', { method: 'POST' });
    return res.json();
  }
};

