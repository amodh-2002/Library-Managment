import React, { useState, useEffect } from 'react';
import { BiBookReader, BiError, BiRupee } from 'react-icons/bi';
import api from '../services/api';

const TransactionForm = () => {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    book_id: '',
    member_id: ''
  });

  useEffect(() => {
    loadBooksAndMembers();
  }, []);

  const loadBooksAndMembers = async () => {
    try {
      const [booksRes, membersRes] = await Promise.all([
        api.getBooks(),
        api.getMembers()
      ]);
      setBooks(booksRes.data);
      setMembers(membersRes.data);
    } catch (error) {
      setError('Failed to load data. Please refresh the page.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.createTransaction(formData);
      setSuccess(response.data.message || 'Book issued successfully!');
      setFormData({ book_id: '', member_id: '' });
      loadBooksAndMembers(); // Refresh the books list to update stock
    } catch (error) {
      setError(
        error.response?.data?.error || 
        'Failed to issue book. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getMemberDebtStatus = (debt) => {
    if (debt >= 500) {
      return {
        color: 'text-red-600',
        message: 'Cannot issue books (Debt limit exceeded)',
        canIssue: false
      };
    } else if (debt >= 400) {
      return {
        color: 'text-orange-600',
        message: 'Approaching debt limit',
        canIssue: true
      };
    } else {
      return {
        color: 'text-green-600',
        message: 'Eligible for new books',
        canIssue: true
      };
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Issue Book</h1>
        <p className="text-gray-600 mt-1">Issue a book to a library member</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center">
          <BiError className="mr-2" />
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Book
            </label>
            <select
              name="book_id"
              value={formData.book_id}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
            >
              <option value="">Choose a book</option>
              {books.map(book => (
                <option 
                  key={book.id} 
                  value={book.id}
                  disabled={book.stock <= 0}
                >
                  {book.title} ({book.stock} available)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Member
            </label>
            <select
              name="member_id"
              value={formData.member_id}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
            >
              <option value="">Choose a member</option>
              {members.map(member => {
                const debtStatus = getMemberDebtStatus(member.outstanding_debt);
                return (
                  <option 
                    key={member.id} 
                    value={member.id}
                    disabled={!debtStatus.canIssue}
                    className={debtStatus.color}
                  >
                    {member.name} - Debt: ₹{member.outstanding_debt} ({debtStatus.message})
                  </option>
                );
              })}
            </select>
          </div>

          {formData.member_id && (
            <div className="p-3 bg-gray-50 rounded-md">
              {(() => {
                const selectedMember = members.find(m => m.id === parseInt(formData.member_id));
                if (selectedMember) {
                  const debtStatus = getMemberDebtStatus(selectedMember.outstanding_debt);
                  return (
                    <div className={`flex items-center ${debtStatus.color}`}>
                      <BiRupee className="mr-1" />
                      <span>Outstanding Debt: ₹{selectedMember.outstanding_debt}</span>
                      <span className="ml-2">({debtStatus.message})</span>
                    </div>
                  );
                }
              })()}
            </div>
          )}
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={loading || (formData.member_id && 
              members.find(m => m.id === parseInt(formData.member_id))?.outstanding_debt >= 500)}
            className="w-full flex items-center justify-center px-4 py-2 bg-secondary text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {loading ? (
              'Processing...'
            ) : (
              <>
                <BiBookReader className="mr-2" />
                Issue Book
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm; 