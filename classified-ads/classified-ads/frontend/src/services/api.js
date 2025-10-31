import axios from 'axios';

const api = axios.create({
  baseURL: (process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api',
});

export const getImageUrl = (path) => {
  return api.defaults.baseURL.replace('/api', '') + `/uploads/${path}`;
};

// Ensure HTTPS is used in production for Stripe and API calls
if (process.env.NODE_ENV === 'production' && window.location.protocol !== 'https:') {
  window.location.href = window.location.href.replace('http:', 'https:');
}


export default api;
