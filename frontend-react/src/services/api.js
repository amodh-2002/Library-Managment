import axios from "axios";

const API_URL = "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor
axiosInstance.interceptors.request.use((config) => {
  // Remove trailing slashes from the URL
  config.url = config.url.replace(/\/+$/, '');
  return config;
});

export const api = {
  // Books
  getBooks: () => axiosInstance.get('/books'),
  createBook: (book) => axiosInstance.post('/books', book),
  updateBook: (id, book) => axiosInstance.put(`/books/${id}`, book),
  deleteBook: (id) => axiosInstance.delete(`/books/${id}`),
  importBooks: (books) => axiosInstance.post('/books/import', books),

  // Members
  getMembers: () => axiosInstance.get('/members'),
  createMember: (member) => axiosInstance.post('/members', member),
  updateMember: (id, member) => axiosInstance.put(`/members/${id}`, member),
  deleteMember: (id) => axiosInstance.delete(`/members/${id}`),

  // Transactions
  getActiveTransactions: () => axiosInstance.get('/transactions/active'),
  createTransaction: (transaction) => axiosInstance.post('/transactions/issue', transaction),
  returnBook: (transactionId) => axiosInstance.put(`/transactions/return/${transactionId}`)
};

export default api;
