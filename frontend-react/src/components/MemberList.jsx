import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BiUserPlus, BiEdit, BiTrash, BiRupee } from 'react-icons/bi';
import api from '../services/api';

const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingMember, setEditingMember] = useState(null);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const response = await api.getMembers();
      setMembers(response.data);
    } catch (error) {
      setError('Failed to load members');
      console.error('Error loading members:', error);
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
  };

  const handleUpdate = async (member) => {
    try {
      setLoading(true);
      await api.updateMember(member.id, member);
      setEditingMember(null);
      loadMembers();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update member');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (memberId) => {
    if (!window.confirm('Are you sure you want to delete this member?')) return;
    
    try {
      setLoading(true);
      await api.deleteMember(memberId);
      loadMembers();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to delete member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Library Members</h1>
        <Link
          to="/add-member"
          className="inline-flex items-center px-4 py-2 bg-secondary text-white rounded-md hover:bg-blue-600"
        >
          <BiUserPlus className="mr-2" />
          Add New Member
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            {editingMember?.id === member.id ? (
              // Edit form
              <form onSubmit={(e) => {
                e.preventDefault();
                handleUpdate(editingMember);
              }}>
                <input
                  type="text"
                  value={editingMember.name}
                  onChange={(e) => setEditingMember({...editingMember, name: e.target.value})}
                  className="w-full mb-2 p-2 border rounded"
                  placeholder="Name"
                />
                <input
                  type="email"
                  value={editingMember.email}
                  onChange={(e) => setEditingMember({...editingMember, email: e.target.value})}
                  className="w-full mb-2 p-2 border rounded"
                  placeholder="Email"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setEditingMember(null)}
                    className="px-3 py-1 text-gray-600 border rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
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
                  {member.name}
                </h3>
                <div className="text-gray-600">
                  <p>Email: {member.email}</p>
                  <div className="flex items-center mt-2">
                    <BiRupee className="text-gray-500" />
                    <p className={`font-medium ${
                      member.outstanding_debt > 500 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      Outstanding Debt: {member.outstanding_debt}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => handleEdit(member)}
                    disabled={loading}
                    className="p-2 text-blue-600 hover:text-blue-800"
                  >
                    <BiEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    disabled={loading || member.outstanding_debt > 0}
                    title={member.outstanding_debt > 0 ? "Cannot delete member with outstanding debt" : ""}
                    className={`p-2 ${
                      member.outstanding_debt > 0 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-red-600 hover:text-red-800'
                    }`}
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

export default MemberList; 