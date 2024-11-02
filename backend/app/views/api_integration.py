from flask import Blueprint, jsonify, request
import requests
from ..models import Book, db

bp = Blueprint('api_integration', __name__, url_prefix='/api/frappe')

FRAPPE_API_URL = 'https://frappe.io/api/method/frappe-library'

@bp.route('/import', methods=['POST'])
def import_books():
    params = request.json
    
    try:
        response = requests.get(FRAPPE_API_URL, params=params)
        response.raise_for_status()
        books_data = response.json().get('message', [])
        
        imported_count = 0
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
                imported_count += 1
        
        db.session.commit()
        return jsonify({
            'message': f'Successfully imported {imported_count} books'
        }), 201
        
    except requests.RequestException as e:
        return jsonify({'error': str(e)}), 500 