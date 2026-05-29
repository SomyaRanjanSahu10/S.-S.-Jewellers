import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor: attach access token ──────────────
api.interceptors.request.use(
  (config) => {
    // Read from Zustand persisted storage
    try {
      const raw = localStorage.getItem('ss-jewellers-auth');
      if (raw) {
        const { state } = JSON.parse(raw);
        if (state?.accessToken) {
          config.headers.Authorization = `Bearer ${state.accessToken}`;
        }
      }
    } catch (_) {}
    return config;
  },
  (err) => Promise.reject(err)
);

// ── Response interceptor: silent token refresh ────────────
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && err.response?.data?.code === 'TOKEN_EXPIRED' && !original._retry) {
      original._retry = true;
      try {
        const raw = localStorage.getItem('ss-jewellers-auth');
        const { state } = JSON.parse(raw);
        const { data } = await axios.post(`${API_BASE}/auth/refresh`, {
          refreshToken: state.refreshToken,
        });
        // Update store
        const storeRaw = JSON.parse(raw);
        storeRaw.state.accessToken  = data.data.accessToken;
        storeRaw.state.refreshToken = data.data.refreshToken;
        localStorage.setItem('ss-jewellers-auth', JSON.stringify(storeRaw));
        original.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(original);
      } catch (_) {
        // Force logout
        localStorage.removeItem('ss-jewellers-auth');
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

// ── API helpers ────────────────────────────────────────────
export const productApi = {
  getAll:     (params) => api.get('/products', { params }),
  getById:    (id)     => api.get(`/products/${id}`),
  getFeatured:()       => api.get('/products/featured'),
  getRelated: (id)     => api.get(`/products/${id}/related`),
  create:     (data)   => api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update:     (id, d)  => api.put(`/products/${id}`, d, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete:     (id)     => api.delete(`/products/${id}`),
};

export const authApi = {
  register:       (d) => api.post('/auth/register', d),
  login:          (d) => api.post('/auth/login', d),
  logout:         ()  => api.post('/auth/logout'),
  forgotPassword: (e) => api.post('/auth/forgot-password', { email: e }),
  resetPassword:  (d) => api.post('/auth/reset-password', d),
  getMe:          ()  => api.get('/auth/me'),
};

export const orderApi = {
  place:      (d)   => api.post('/orders', d),
  getMyOrders:(p)   => api.get('/orders/my', { params: p }),
  getById:    (id)  => api.get(`/orders/${id}`),
  cancel:     (id, reason) => api.put(`/orders/${id}/cancel`, { reason }),
  // Admin
  getAll:     (p)   => api.get('/orders', { params: p }),
  updateStatus:(id, d) => api.put(`/orders/${id}/status`, d),
};

export const paymentApi = {
  createOrder:    (orderId) => api.post('/payments/create-order', { orderId }),
  verify:         (d)       => api.post('/payments/verify', d),
  validateCoupon: (d)       => api.post('/payments/validate-coupon', d),
};

export const wishlistApi = {
  get:    ()   => api.get('/wishlist'),
  toggle: (id) => api.post(`/wishlist/toggle/${id}`),
};

export const reviewApi = {
  getForProduct: (pid) => api.get(`/reviews/product/${pid}`),
  create:        (d)   => api.post('/reviews', d),
};

export const adminApi = {
  getAnalytics: () => api.get('/admin/analytics'),
  getUsers:     () => api.get('/admin/users'),
};

export const appointmentApi = {
  book: (d) => api.post('/appointments', d),
};

export default api;
