import requests
from typing import Dict, Any, List
from ..models import Book, db

def import_books_from_frappe(params: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Helper function to call Frappe API and import books"""
    url = 'https://frappe.io/api/method/frappe-library'
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        books_data = response.json().get('message', [])
        
        imported_books = []
        for book_data in books_data:
            # Check if book already exists
            existing_book = Book.query.filter_by(isbn=book_data['isbn']).first()
            if not existing_book:
                book = Book(
                    title=book_data['title'],
                    author=book_data['authors'],
                    isbn=book_data['isbn'],
                    publisher=book_data['publisher'],
                    stock=1  # Default stock value
                )
                db.session.add(book)
                imported_books.append(book)
        
        if imported_books:
            db.session.commit()
            
        return imported_books
    except requests.RequestException as e:
        raise Exception(f"Failed to fetch books from Frappe API: {str(e)}") 