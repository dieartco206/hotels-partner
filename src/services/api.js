const API_BASE_URL = 'http://localhost:8080/api';

export const getAuthToken = () => localStorage.getItem('partner_jwt_token');
export const setAuthToken = (token) => localStorage.setItem('partner_jwt_token', token);
export const removeAuthToken = () => localStorage.removeItem('partner_jwt_token');

export const getAuthUser = () => {
  try {
    const raw = localStorage.getItem('partner_user');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};
export const setAuthUser = (user) => localStorage.setItem('partner_user', JSON.stringify(user));
export const removeAuthUser = () => localStorage.removeItem('partner_user');

async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }
    return data;
  } catch (err) {
    console.error(`API Error [${endpoint}]:`, err);
    throw err;
  }
}

export const partnerApi = {
  // Authentication
  login: async (email, password) => {
    const res = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res.data?.token) {
      setAuthToken(res.data.token);
      setAuthUser(res.data.user);
    }
    return res.data;
  },
  
  getMe: async () => {
    return request('/auth/me');
  },

  // Dashboard
  getDashboard: async () => {
    return request('/partner/dashboard');
  },

  // Hotels
  getHotels: async () => {
    return request('/partner/hotels');
  },

  updateHotel: async (id, data) => {
    return request(`/partner/hotels/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Rooms
  createRoom: async (roomData) => {
    return request('/partner/rooms', {
      method: 'POST',
      body: JSON.stringify(roomData),
    });
  },

  updateRoom: async (id, roomData) => {
    return request(`/partner/rooms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(roomData),
    });
  },

  updateAllotment: async (id, allotmentData) => {
    return request(`/partner/rooms/${id}/allotment`, {
      method: 'PATCH',
      body: JSON.stringify(allotmentData),
    });
  },

  // Bookings & Check-in
  getBookings: async (status = 'all') => {
    const query = status && status !== 'all' ? `?status=${status}` : '';
    return request(`/partner/bookings${query}`);
  },

  checkInGuest: async (codeOrQR) => {
    return request('/partner/checkin', {
      method: 'POST',
      body: JSON.stringify({ code_or_qr: codeOrQR }),
    });
  },

  // Settlements
  getSettlements: async () => {
    return request('/partner/settlements');
  },
};
