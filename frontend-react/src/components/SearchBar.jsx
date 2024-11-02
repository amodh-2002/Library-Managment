import React from 'react';
import { BiSearch } from 'react-icons/bi';

const SearchBar = ({ onSearch }) => {
  return (
    <div className="relative">
      <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      <input
        type="text"
        placeholder="Search by title or author..."
        onChange={(e) => onSearch(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
      />
    </div>
  );
};

export default SearchBar; 