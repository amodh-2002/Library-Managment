from flask import Blueprint, jsonify, request, make_response
import requests
from ..models import Book, db

bp = Blueprint('api_integration', __name__, url_prefix='/api/frappe')

FRAPPE_API_URL = 'https://frappe.io/api/method/frappe-library'

@bp.route('/search', methods=['GET', 'OPTIONS'])
def search_books():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add('Access-Control-Allow-Origin', request.origin)
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'GET, OPTIONS')
        return response

    try:
        # Forward the query parameters to Frappe API
        params = {
            'title': request.args.get('title', ''),
            'authors': request.args.get('authors', ''),
            'isbn': request.args.get('isbn', ''),
            'publisher': request.args.get('publisher', ''),
            'page': request.args.get('page', '1')
        }
        
        response = requests.get(FRAPPE_API_URL, params=params)
        response.raise_for_status()
        return jsonify(response.json())
        
    except requests.RequestException as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/import', methods=['POST', 'OPTIONS'])
def import_books():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add('Access-Control-Allow-Origin', request.origin)
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        return response

    try:
        books_data = request.json
        if not isinstance(books_data, list):
            books_data = [books_data]  # Convert single book to list
            
        imported_count = 0
        
        for book_data in books_data:
            # Check if book already exists
            existing_book = Book.query.filter_by(isbn=book_data['isbn']).first()
            if not existing_book:
                # Clean and truncate the data
                title = book_data['title'][:200].encode('utf-8').decode('utf-8')
                author = book_data['authors'][:500].encode('utf-8').decode('utf-8')
                publisher = book_data['publisher'][:200].encode('utf-8').decode('utf-8') if book_data.get('publisher') else None
                
                book = Book(
                    title=title,
                    author=author,
                    isbn=book_data['isbn'],
                    publisher=publisher,
                    stock=1  # Default stock value
                )
                db.session.add(book)
                imported_count += 1
        
        if imported_count > 0:
            db.session.commit()
            
        return jsonify({
            'message': f'Successfully imported {imported_count} books'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400