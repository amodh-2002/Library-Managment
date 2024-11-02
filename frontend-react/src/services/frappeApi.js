import axios from 'axios';

const API_URL = "http://localhost:5000/api"; // Use our backend URL

export const searchBooks = async (params) => {
  try {
    const response = await axios.get(`${API_URL}/frappe/search`, { params });
    return response.data.message;
  } catch (error) {
    console.error('Error fetching books from Frappe API:', error);
    throw error;
  }
};

export default {
  searchBooks
}; 