import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { BiBook, BiUser, BiBookAdd, BiImport } from "react-icons/bi";
import BookList from "./components/BookList";
import MemberList from "./components/MemberList";
import BookForm from "./components/BookForm";
import MemberForm from "./components/MemberForm";
import TransactionForm from "./components/TransactionForm";
import ReturnBook from "./components/ReturnBook";
import ImportBooks from "./components/ImportBooks";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Link to="/" className="flex items-center">
                  <BiBook className="h-8 w-8 text-secondary" />
                  <h1 className="ml-2 text-2xl font-bold text-gray-900">
                    Library Management System
                  </h1>
                </Link>
              </div>
              <nav className="flex space-x-8">
                <Link
                  to="/"
                  className="text-gray-700 hover:text-secondary flex items-center"
                >
                  <BiBook className="mr-1" />
                  Books
                </Link>
                <Link
                  to="/members"
                  className="text-gray-700 hover:text-secondary flex items-center"
                >
                  <BiUser className="mr-1" />
                  Members
                </Link>
                <Link
                  to="/transaction"
                  className="text-gray-700 hover:text-secondary flex items-center"
                >
                  <BiBookAdd className="mr-1" />
                  Issue Book
                </Link>
                <Link
                  to="/return-book"
                  className="text-gray-700 hover:text-secondary flex items-center"
                >
                  <BiBook className="mr-1" />
                  Return Book
                </Link>
                <Link
                  to="/import-books"
                  className="text-gray-700 hover:text-secondary flex items-center"
                >
                  <BiImport className="mr-1" />
                  Import Books
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h2 className="text-xl text-gray-600">
              Efficiently manage your library's resources
            </h2>
          </div>
          <Routes>
            <Route path="/" element={<BookList />} />
            <Route path="/members" element={<MemberList />} />
            <Route path="/add-book" element={<BookForm />} />
            <Route path="/add-member" element={<MemberForm />} />
            <Route path="/transaction" element={<TransactionForm />} />
            <Route path="/return-book" element={<ReturnBook />} />
            <Route path="/import-books" element={<ImportBooks />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
