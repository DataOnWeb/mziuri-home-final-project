import axios from 'axios';

// Make sure this port matches your Node.js server port (3003 from your index.js)
const API_BASE_URL = 'http://localhost:3000/api';

// Configure axios defaults for all requests
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
    // Format the data exactly as the backend expects it
    const response = await axios.post(`${API_BASE_URL}/users/register`, {
      // Create username by combining first and last name with a space
      username: `${userData.firstName} ${userData.lastName}`,
      email: userData.email,
      password: userData.password,
    });
    return response.data;
  } catch (err) {
    console.error('Error registering user:', err);
    // Return the error response data for better error handling
    if (err.response && err.response.data) {
      throw err.response.data;
    }
    throw err;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/users/login`,
      {
        usernameOrPassword: credentials.email, // Backend expects usernameOrPassword field
        password: credentials.password,
      },
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      }
    );

    // Return data directly for consistency
    return response.data;
  } catch (err) {
    console.error('Error logging in:', err);
    // Format error response consistently
    return { err: err.response?.data?.err || err.message || 'Login failed' };
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
