import axios from 'axios';

const rawBaseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const baseURL = rawBaseURL.endsWith('/api') ? rawBaseURL : `${rawBaseURL}/api`;

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request Interceptor ────────────────────────────────────────────────────────
// Automatically attach the JWT token from localStorage to every request.
// This is a belt-and-suspenders approach alongside the AuthContext header setter.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && !config.headers['Authorization']) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ───────────────────────────────────────────────────────
// Automatically handle 401 Unauthorized by clearing stale auth state.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    }
    return Promise.reject(error);
  }
);

// ── Booking API ────────────────────────────────────────────────────────────────
export const createOrder = async (bookingData) => {
  try {
    const res = await api.post('/create-order', bookingData);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const verifyPayment = async (paymentData, formData) => {
  try {
    const res = await api.post('/verify-payment', { ...paymentData, formData });
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const submitFeedback = async (feedbackData) => {
  try {
    const res = await api.post('/submit-feedback', feedbackData);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getMyBookings = async () => {
  try {
    const res = await api.get('/my-bookings');
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const submitContact = async (contactData) => {
  try {
    const res = await api.post('/contact', contactData);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ── Auth API ───────────────────────────────────────────────────────────────────
export const registerUser = async (userData) => {
  try {
    const res = await api.post('/auth/register', userData);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const requestCancelBooking = async (id, reason) => {
  try {
    const res = await api.post(`/bookings/${id}/request-cancel`, { reason });
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const requestRescheduleBooking = async (id, rescheduleData) => {
  try {
    const res = await api.post(`/bookings/${id}/request-reschedule`, rescheduleData);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default api;
