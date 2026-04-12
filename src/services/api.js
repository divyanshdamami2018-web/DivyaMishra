import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

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
    const res = await api.post('/verify-payment', {
      ...paymentData,
      formData
    });
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

// Auth
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

export default api;
