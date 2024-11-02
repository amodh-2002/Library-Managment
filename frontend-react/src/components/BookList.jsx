import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BiSearch, BiPlus, BiEdit, BiTrash } from 'react-icons/bi';
import api from '../services/api';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingBook, setEditingBook] = useState(null);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const response = await api.getBooks();
      setBooks(response.data);
      setFilteredBooks(response.data);
    } catch (error) {
      console.error('Error loading books:', error);
    }
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = books.filter(
      (book) =>
        book.title.toLowerCase().includes(term) ||
        book.author.toLowerCase().includes(term)
    );
    setFilteredBooks(filtered);
  };

  const handleEdit = async (book) => {
    setEditingBook(book);
  };

  const handleUpdate = async (book) => {
    try {
      setLoading(true);
      await api.updateBook(book.id, book);
      setEditingBook(null);
      loadBooks();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update book');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    
    try {
      setLoading(true);
      await api.deleteBook(bookId);
      loadBooks();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to delete book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Books Inventory</h1>
        <Link
          to="/add-book"
          className="inline-flex items-center px-4 py-2 bg-secondary text-white rounded-md hover:bg-blue-600"
        >
          <BiPlus className="mr-2" />
          Add New Book
        </Link>
      </div>

      <div className="mb-6">
        <div className="relative">
          <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title or author..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            {editingBook?.id === book.id ? (
              // Edit form
              <form onSubmit={(e) => {
                e.preventDefault();
                handleUpdate(editingBook);
              }}>
                <input
                  type="text"
                  value={editingBook.title}
                  onChange={(e) => setEditingBook({...editingBook, title: e.target.value})}
                  className="w-full mb-2 p-2 border rounded"
                />
                <input
                  type="text"
                  value={editingBook.author}
                  onChange={(e) => setEditingBook({...editingBook, author: e.target.value})}
                  className="w-full mb-2 p-2 border rounded"
                />
                <input
                  type="number"
                  value={editingBook.stock}
                  onChange={(e) => setEditingBook({...editingBook, stock: parseInt(e.target.value)})}
                  className="w-full mb-2 p-2 border rounded"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setEditingBook(null)}
                    className="px-3 py-1 text-gray-600 border rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-secondary text-white rounded"
                  >
                    Save
                  </button>
                </div>
              </form>
            ) : (
              // Display mode
              <>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {book.title}
                </h3>
                <div className="text-gray-600">
                  <p>Author: {book.author}</p>
                  <p>ISBN: {book.isbn}</p>
                  <p className={`font-medium ${book.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    Stock: {book.stock}
                  </p>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => handleEdit(book)}
                    className="p-2 text-blue-600 hover:text-blue-800"
                  >
                    <BiEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(book.id)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <BiTrash />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookList; 