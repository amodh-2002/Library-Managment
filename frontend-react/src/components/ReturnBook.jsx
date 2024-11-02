import React, { useState, useEffect } from "react";
import { BiBook, BiRupee } from "react-icons/bi";
import api from "../services/api";

const ReturnBook = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadActiveTransactions();
  }, []);

  const loadActiveTransactions = async () => {
    try {
      const response = await api.getActiveTransactions();
      setTransactions(response.data);
    } catch (error) {
      setError("Failed to load active transactions");
    }
  };

  const handleReturn = async (transactionId) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.returnBook(transactionId);
      setSuccess(response.data.message);
      loadActiveTransactions(); // Refresh the list
    } catch (error) {
      setError(error.response?.data?.error || "Failed to return book");
    } finally {
      setLoading(false);
    }
  };

  const calculateExpectedFee = (issueDate) => {
    const days = Math.floor(
      (new Date() - new Date(issueDate)) / (1000 * 60 * 60 * 24)
    );
    return Math.max(days * 10, 0); // Rs. 10 per day
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Return Books</h2>

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

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Book
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Member
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Issue Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expected Fee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {transaction.book.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {transaction.member.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(transaction.issue_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-orange-600">
                    <BiRupee />
                    {calculateExpectedFee(transaction.issue_date)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleReturn(transaction.id)}
                    disabled={loading}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-secondary hover:bg-blue-600 disabled:bg-blue-300"
                  >
                    <BiBook className="mr-1" />
                    Return
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReturnBook;
