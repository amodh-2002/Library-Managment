import React, { useState } from 'react';
import { BiImport, BiBook, BiSearch } from 'react-icons/bi';
import frappeApi from '../services/frappeApi';
import api from '../services/api';

const BOOKS_PER_PAGE = 10; // Number of books to show per page

const ImportBooks = () => {
  const [searchParams, setSearchParams] = useState({
    title: '',
    authors: '',
    isbn: '',
    publisher: '',
    page: 1
  });
  const [searchResults, setSearchResults] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination values
  const totalBooks = searchResults.length;
  const totalPages = Math.ceil(totalBooks / BOOKS_PER_PAGE);
  const startIndex = (currentPage - 1) * BOOKS_PER_PAGE;
  const endIndex = startIndex + BOOKS_PER_PAGE;
  const currentBooks = searchResults.slice(startIndex, endIndex);

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError('');
      const books = await frappeApi.searchBooks(searchParams);
      setSearchResults(books);
      setCurrentPage(1); // Reset to first page on new search
    } catch (error) {
      setError('Failed to fetch books from Frappe API');
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (selectedBooks.length === 0) {
      setError('Please select books to import');
      return;
    }

    try {
      setLoading(true);
      const response = await api.importBooks(selectedBooks);
      
      // Show detailed success message
      setSuccess(response.data.message);
      
      // Clear selections and results only on successful import
      if (response.data.imported > 0) {
        setSelectedBooks([]);
        setSearchResults([]);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('Import error:', error);
      setError(
        error.response?.data?.error || 
        error.response?.data?.message || 
        'Failed to import books'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const toggleBookSelection = (book) => {
    if (selectedBooks.find(b => b.isbn === book.isbn)) {
      setSelectedBooks(selectedBooks.filter(b => b.isbn !== book.isbn));
    } else {
      setSelectedBooks([...selectedBooks, book]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Import Books from Frappe Library</h2>

      {/* Search Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={searchParams.title}
              onChange={(e) => setSearchParams({...searchParams, title: e.target.value})}
              className="w-full p-2 border rounded"
              placeholder="Search by title..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author
            </label>
            <input
              type="text"
              value={searchParams.authors}
              onChange={(e) => setSearchParams({...searchParams, authors: e.target.value})}
              className="w-full p-2 border rounded"
              placeholder="Search by author..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ISBN
            </label>
            <input
              type="text"
              value={searchParams.isbn}
              onChange={(e) => setSearchParams({...searchParams, isbn: e.target.value})}
              className="w-full p-2 border rounded"
              placeholder="Search by ISBN..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Publisher
            </label>
            <input
              type="text"
              value={searchParams.publisher}
              onChange={(e) => setSearchParams({...searchParams, publisher: e.target.value})}
              className="w-full p-2 border rounded"
              placeholder="Search by publisher..."
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleSearch}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-secondary text-white rounded hover:bg-blue-600"
          >
            <BiSearch className="mr-2" />
            Search Books
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
          {success}
        </div>
      )}

      {/* Results */}
      {searchResults.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              Search Results ({totalBooks} books)
            </h3>
            <button
              onClick={handleImport}
              disabled={selectedBooks.length === 0 || loading}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-300"
            >
              <BiImport className="mr-2" />
              Import Selected ({selectedBooks.length})
            </button>
          </div>

          {/* Pagination Info */}
          <div className="text-sm text-gray-600 mb-4">
            Showing {startIndex + 1} to {Math.min(endIndex, totalBooks)} of {totalBooks} books
          </div>

          <div className="grid grid-cols-1 gap-4 mb-4">
            {currentBooks.map((book, index) => (
              <div
                key={`${book.isbn}-${startIndex + index}`}
                className={`p-4 border rounded flex items-center justify-between ${
                  selectedBooks.find(b => 
                    b.isbn === book.isbn && 
                    b.title === book.title && 
                    b.authors === book.authors
                  )
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}
              >
                <div>
                  <h4 className="font-semibold">{book.title}</h4>
                  <p className="text-sm text-gray-600">By {book.authors}</p>
                  <p className="text-sm text-gray-600">ISBN: {book.isbn}</p>
                  <p className="text-sm text-gray-600">Publisher: {book.publisher}</p>
                </div>
                <button
                  onClick={() => toggleBookSelection(book)}
                  className={`p-2 rounded ${
                    selectedBooks.find(b => 
                      b.isbn === book.isbn && 
                      b.title === book.title && 
                      b.authors === book.authors
                    )
                      ? 'text-blue-600 hover:text-blue-700'
                      : 'text-gray-600 hover:text-gray-700'
                  }`}
                >
                  <BiBook size={24} />
                </button>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t pt-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="text-sm text-gray-600">
                {BOOKS_PER_PAGE} books per page
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImportBooks; 