# Library Management System

A modern, full-stack library management system that helps librarians manage books, members, and transactions efficiently. The system includes features for managing book inventory, member records, book issuance, returns, and integrates with the Frappe API for book imports.

![Library Management System](screenshot.png)

## Features

- **Book Management**

  - Add, edit, and delete books
  - Search books by title and author
  - Import books from Frappe Library API
  - Track book stock

- **Member Management**

  - Register new members
  - Update member information
  - Track outstanding debts
  - Enforce debt limits (Rs. 500 maximum)

- **Transaction Management**

  - Issue books to members
  - Process book returns
  - Calculate rent fees (Rs. 10 per day)
  - Track transaction history

- **Import Integration**
  - Search books from Frappe Library API
  - Batch import selected books
  - Pagination and filtering support

## Tech Stack

### Frontend

- Vite + React 18
- React Router v6
- Axios for API calls
- Tailwind CSS for styling
- React Icons
- Vite for build tooling

### Backend

- Python 3.9+
- Flask
- Flask-SQLAlchemy
- Flask-Migrate
- Flask-CORS
- MySQL Database

## Prerequisites

- Python 3.9 or higher
- Node.js 14 or higher
- MySQL Server
- Git

## Installation

1. **Clone the Repository**
   [git clone https://github.com/amodh-2002/Library-Managment.git](https://github.com/amodh-2002/Library-Managment.git)
   cd Library-Managment
2. **Setup Backend**

## Navigate to backend directory

cd backend

## Create virtual environment

python -m venv venv

## Activate virtual environment

On Windows:
venv\Scripts\activate
On macOS/Linux:
source venv/bin/activate

## Install dependencies

pip install -r requirements.txt

## Set up environment variables

cp .env.example .env
Edit .env with your database credentials

## Initialize database

flask db upgrade

## Run the server

flask run

3. **Set up Frontend**

## Navigate to frontend directory

cd frontend-react

## Install dependencies

npm install

## Run the development server

npm run dev

## Environment Variables

### Backend (.env)

DATABASE_URL=mysql://username:password@localhost/library_db
SECRET_KEY=your-secret-key-here

### Frontend

The frontend uses environment variables for API URLs. Create a `.env` file in the frontend directory:

VITE_API_URL=http://localhost:5000/api

## Usage

1. **Access the Application**

   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

2. **Managing Books**

   - Add books manually through the "Add Book" form
   - Import books from Frappe API using the "Import Books" feature
   - Edit or delete books from the book list

3. **Managing Members**

   - Register new members with name and email
   - Track member's outstanding debt
   - Members cannot borrow books if debt exceeds Rs. 500

4. **Transactions**
   - Issue books to members
   - Return books and calculate rent
   - View transaction history

## API Endpoints

### Books

- `GET /api/books` - List all books
- `POST /api/books` - Add a new book
- `PUT /api/books/:id` - Update a book
- `DELETE /api/books/:id` - Delete a book
- `POST /api/books/import` - Import books from Frappe API

### Members

- `GET /api/members` - List all members
- `POST /api/members` - Add a new member
- `PUT /api/members/:id` - Update a member
- `DELETE /api/members/:id` - Delete a member

### Transactions

- `POST /api/transactions/issue` - Issue a book
- `PUT /api/transactions/return/:id` - Return a book
- `GET /api/transactions/active` - List active transactions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Acknowledgments

- [Tailwind CSS](https://tailwindcss.com/) for styling
- [React Icons](https://react-icons.github.io/react-icons/) for icons

Project Link: [https://github.com/amodh-2002/Library-Managment](https://github.com/amodh-2002/Library-Managment)
