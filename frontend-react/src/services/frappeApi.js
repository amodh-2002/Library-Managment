import axios from 'axios';

const FRAPPE_API_URL = 'https://frappe.io/api/method/frappe-library';

export const searchBooks = async (params) => {
  try {
    const response = await axios.get(FRAPPE_API_URL, { params });
    return response.data.message;
  } catch (error) {
    console.error('Error fetching books from Frappe API:', error);
    throw error;
  }
};

export default {
  searchBooks
}; 