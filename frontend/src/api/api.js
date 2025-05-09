
import axios from 'axios';


const API_BASE_URL = 'http://localhost:3000/api';

export const getProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products`);
    return response.data;
  } catch (err) {
    console.error("Error fetching products:", err);
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