import { Partner, Category, AppSettings, ClickData, User, AppEvent, Faq, Activity, Redemption, Promo } from './types';

// Global helper: dispatch event when user session is invalid (404)
// UserApp root listens for this and triggers a clean logout
export function dispatchUserNotFound() {
  window.dispatchEvent(new CustomEvent('user-not-found'));
}

export const api = {

  login: async (whatsapp: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ whatsapp, password })
    });
    return res.json();
  },
  register: async (whatsapp: string, password: string, name: string, email: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ whatsapp, password, name, email })
    });
    return res.json();
  },

  // Vendor Auth
  vendorLogin: async (whatsapp: string, password: string): Promise<{ success: boolean; role?: 'admin' | 'vendor'; partner?: Partner | null; error?: string; status?: string }> => {
    const res = await fetch('/api/vendor/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ whatsapp, password })
    });
    return res.json();
  },
  vendorRegister: async (data: {
    name: string; categoryId: string; description: { ko: string; en: string; id: string };
    vendorLoginWhatsapp: string; vendorPassword: string;
    logo?: string; banner?: string; instagram?: string; whatsapp?: string; website?: string; googleMapsUrl?: string;
  }): Promise<{ success: boolean; partner?: Partner; error?: string }> => {
    const res = await fetch('/api/vendor/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  approveVendor: async (id: string): Promise<{ success: boolean }> => {
    const res = await fetch(`/api/partners/${id}/approve`, { method: 'PUT', headers: { 'Content-Type': 'application/json' } });
    return res.json();
  },
  rejectVendor: async (id: string): Promise<{ success: boolean }> => {
    const res = await fetch(`/api/partners/${id}/reject`, { method: 'PUT', headers: { 'Content-Type': 'application/json' } });
    return res.json();
  },

  // Promo CRUD
  getPromos: async (partnerId: string): Promise<Promo[]> => {
    const res = await fetch(`/api/partners/${partnerId}/promos`);
    return res.json();
  },
  createPromo: async (partnerId: string, data: Omit<Promo, 'id'>): Promise<Promo> => {
    const res = await fetch(`/api/partners/${partnerId}/promos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  updatePromo: async (partnerId: string, promoId: string, data: Partial<Promo>): Promise<Promo> => {
    const res = await fetch(`/api/partners/${partnerId}/promos/${promoId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  deletePromo: async (partnerId: string, promoId: string): Promise<void> => {
    await fetch(`/api/partners/${partnerId}/promos/${promoId}`, { method: 'DELETE' });
  },

  getSettings: async (): Promise<AppSettings> => {
    const res = await fetch('/api/settings');
    return res.json();
  },
  updateSettings: async (data: Partial<AppSettings>): Promise<AppSettings> => {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  getCategories: async (): Promise<Category[]> => {
    const res = await fetch('/api/categories');
    return res.json();
  },
  createCategory: async (data: Partial<Category>): Promise<Category> => {
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  updateCategory: async (id: string, data: Partial<Category>): Promise<Category> => {
    const res = await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  deleteCategory: async (id: string): Promise<void> => {
    await fetch(`/api/categories/${id}`, { method: 'DELETE' });
  },
  getPartners: async (): Promise<Partner[]> => {
    const res = await fetch('/api/partners');
    return res.json();
  },
  createPartner: async (data: Partial<Partner>): Promise<Partner> => {
    const res = await fetch('/api/partners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  updatePartner: async (id: string, data: Partial<Partner>): Promise<Partner> => {
    const res = await fetch(`/api/partners/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  deletePartner: async (id: string): Promise<void> => {
    await fetch(`/api/partners/${id}`, { method: 'DELETE' });
  },
  trackClick: async (partnerId: string, type: string): Promise<void> => {
    await fetch('/api/analytics/click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ partnerId, type })
    });
  },
  getAnalytics: async (): Promise<ClickData> => {
    const res = await fetch('/api/analytics');
    return res.json();
  },
  getUser: async (): Promise<User | null> => {
    const userId = localStorage.getItem('userId') || 'u1';
    const res = await fetch(`/api/user?userId=${userId}`);
    if (res.status === 404) {
      dispatchUserNotFound();
      return null;
    }
    return res.json();
  },
  updateUser: async (user: Partial<User>): Promise<User | null> => {
    const res = await fetch('/api/user', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...user, userId: localStorage.getItem('userId') || 'u1' }),
    });
    if (res.status === 404) {
      dispatchUserNotFound();
      return null;
    }
    return res.json();
  },
  claimDailyMission: async (): Promise<{ success: boolean; user: User }> => {
    const userId = localStorage.getItem('userId') || 'u1';
    const res = await fetch('/api/user/claim_daily', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    return res.json();
  },
  requestContact: async (targetUserId: string): Promise<{ success: boolean; targetUser: User }> => {
    const res = await fetch('/api/user/request_contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetUserId, userId: localStorage.getItem('userId') || 'u1' })
    });
    return res.json();
  },
  respondContactRequest: async (requestId: string, status: 'approved' | 'rejected'): Promise<{ success: boolean; user: User }> => {
    const res = await fetch('/api/user/respond_contact_request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId, status, userId: localStorage.getItem('userId') || 'u1' })
    });
    return res.json();
  },
  saveCoupon: async (couponId: string): Promise<User | null> => {
    const res = await fetch('/api/user/save_coupon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ couponId, userId: localStorage.getItem('userId') || 'u1' }),
    });
    if (res.status === 404) { dispatchUserNotFound(); return null; }
    return res.json();
  },
  redeemCoupon: async (couponId: string, cost: number): Promise<{ success: boolean; user?: User; error?: string }> => {
    const res = await fetch('/api/user/redeem_coupon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ couponId, cost, userId: localStorage.getItem('userId') || 'u1' }),
    });
    if (res.status === 404) { dispatchUserNotFound(); return { success: false, error: 'User not found' }; }
    return res.json();
  },
  getEvents: async (): Promise<AppEvent[]> => {
    const res = await fetch('/api/events');
    return res.json();
  },
  createEvent: async (event: Omit<AppEvent, 'id'>): Promise<AppEvent> => {
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
    return res.json();
  },
  updateEvent: async (id: string, data: Partial<AppEvent>): Promise<AppEvent> => {
    const res = await fetch(`/api/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  deleteEvent: async (id: string): Promise<void> => {
    await fetch(`/api/events/${id}`, { method: 'DELETE' });
  },
  getFaqs: async (): Promise<Faq[]> => {
    const res = await fetch('/api/faqs');
    return res.json();
  },
  createFaq: async (faq: Omit<Faq, 'id'>): Promise<Faq> => {
    const res = await fetch('/api/faqs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(faq),
    });
    return res.json();
  },
  updateFaq: async (id: string, data: Partial<Faq>): Promise<Faq> => {
    const res = await fetch(`/api/faqs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  deleteFaq: async (id: string): Promise<void> => {
    await fetch(`/api/faqs/${id}`, { method: 'DELETE' });
  },
  getActivities: async (): Promise<Activity[]> => {
    const res = await fetch('/api/activities');
    return res.json();
  },
  addActivity: async (partnerName: string): Promise<Activity> => {
    const res = await fetch('/api/activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ partnerName, userId: localStorage.getItem('userId') || 'u1' }),
    });
    return res.json();
  },
  getLeaderboard: async (): Promise<User[]> => {
    const res = await fetch('/api/leaderboard');
    return res.json();
  },
  getUsers: async (): Promise<User[]> => {
    const res = await fetch('/api/users');
    return res.json();
  },
  getRedemptions: async (partnerId?: string): Promise<Redemption[]> => {
    const url = partnerId ? `/api/redemptions?partnerId=${partnerId}` : '/api/redemptions';
    const res = await fetch(url);
    return res.json();
  },
  scanQRRedeem: async (qrData: string): Promise<{ success: boolean; message: string; redemption?: Redemption; user?: User }> => {
    const res = await fetch('/api/vendor/scan_redeem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qrData })
    });
    return res.json();
  },
  claimVipVisit: async (partnerId: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    const res = await fetch('/api/user/claim_vip_visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ partnerId, userId: localStorage.getItem('userId') || 'u1' })
    });
    return res.json();
  },
  resetDatabase: async (): Promise<{ success: boolean; message: string }> => {
    const res = await fetch('/api/admin/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return res.json();
  }
};


