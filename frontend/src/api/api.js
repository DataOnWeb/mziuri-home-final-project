import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

axios.defaults.withCredentials = true;

export const getProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products`);
    return response.data;
  } catch (err) {
    console.error('Error fetching products:', err);
    throw err;
  }
};

export const getProduct = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/register`, {
      username: `${userData.firstName} ${userData.lastName}`,
      email: userData.email,
      password: userData.password,
    });

    if (response.data.err) {
      throw new Error(response.data.err);
    }

    return response.data;
  } catch (err) {
    console.error('Error registering user:', err);

    if (err.response && err.response.data) {
      throw new Error(err.response.data.err || 'Registration failed');
    }
    throw new Error(err.message || 'Registration failed');
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/users/login`,
      {
        usernameOrPassword: credentials.email,
        password: credentials.password,
        rememberMe: credentials.rememberMe || false,
      },
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      }
    );

    if (response.data.err) {
      throw new Error(response.data.err);
    }

    return response.data;
  } catch (err) {
    console.error('Error logging in:', err);
    if (err.response && err.response.data) {
      throw new Error(err.response.data.err || 'Login failed');
    }
    throw new Error(err.message || 'Login failed');
  }
};

export const checkAuth = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/check-auth`);
    return response.data;
  } catch (err) {
    console.error('Error checking auth:', err);
    throw err;
  }
};

export const getToken = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/get-token`);
    return response.data;
  } catch (err) {
    console.error('Error getting token:', err);
    throw err;
  }
};

export const getUser = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/get-user`, {
      headers: { Authorization: token },
    });
    return response.data;
  } catch (err) {
    console.error('Error getting user:', err);
    throw err;
  }
};

export const logoutUser = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/logout`);
    return response.data;
  } catch (err) {
    console.error('Error logging out:', err);
    throw err;
  }
};

export const forgotPasswordUser = (data) => {
  return axios.put(`${API_BASE_URL}/users/forgot-password`, data, {
    withCredentials: true,
  });
};

export const resetPasswordUser = (data, token) => {
  return axios.put(`${API_BASE_URL}/users/reset-password`, data, {
    headers: { Authorization: token },
    withCredentials: true,
  });
};

export const updateUserProfile = async (updateData) => {
  try {
    console.log('API: Sending update request with data:', updateData);

    const response = await axios.put(`${API_BASE_URL}/users/update`, updateData, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      timeout: 10000,
    });

    console.log('API: Update response:', response.data);

    // Validate response structure
    if (!response.data) {
      throw new Error('Empty response from server');
    }

    return response;
  } catch (error) {
    console.error('API: Update error:', error);

    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. Please try again.');
    }

    if (error.response) {
      const serverMessage =
        error.response.data?.message || error.response.data?.err || error.response.data?.error;

      console.log('Server error response:', error.response.data);

      if (serverMessage) {
        throw new Error(serverMessage);
      }

      switch (error.response.status) {
        case 400:
          throw new Error('Invalid data provided. Please check your inputs.');
        case 401:
          throw new Error('Current password is incorrect.');
        case 403:
          throw new Error('You are not authorized to perform this action.');
        case 404:
          throw new Error('User not found.');
        case 409:
          throw new Error('Email already exists.');
        case 500:
          throw new Error('Server error. Please try again later.');
        default:
          throw new Error(`Server error: ${error.response.status}`);
      }
    } else if (error.request) {
      console.log('No response received:', error.request);
      throw new Error('Unable to connect to server. Please check your connection.');
    } else {
      console.log('Request setup error:', error.message);
      throw new Error(error.message || 'An unexpected error occurred.');
    }
  }
};
