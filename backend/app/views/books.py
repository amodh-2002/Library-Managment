from flask import Blueprint, jsonify, request, make_response
from ..models import Book, db

bp = Blueprint('books', __name__, url_prefix='/api/books')

# Handle OPTIONS requests for all routes
@bp.route('', methods=['OPTIONS'])
@bp.route('/<int:book_id>', methods=['OPTIONS'])
def handle_options(book_id=None):
    response = make_response()
    response.headers.add('Access-Control-Allow-Origin', request.origin)
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    return response

@bp.route('', methods=['GET', 'POST'])
def books():
    if request.method == 'GET':
        books = Book.query.all()
        return jsonify([{
            'id': book.id,
            'title': book.title,
            'author': book.author,
            'isbn': book.isbn,
            'publisher': book.publisher,
            'stock': book.stock
        } for book in books])
    
    if request.method == 'POST':
        try:
            data = request.get_json()
            book = Book(
                title=data['title'],
                author=data['author'],
                isbn=data['isbn'],
                publisher=data.get('publisher'),
                stock=data.get('stock', 0)
            )
            db.session.add(book)
            db.session.commit()
            return jsonify({'message': 'Book created successfully'}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 400

@bp.route('/<int:book_id>', methods=['PUT', 'DELETE'])
def book_operations(book_id):
    book = Book.query.get_or_404(book_id)
    
    if request.method == 'PUT':
        try:
            data = request.get_json()
            book.title = data.get('title', book.title)
            book.author = data.get('author', book.author)
            book.isbn = data.get('isbn', book.isbn)
            book.publisher = data.get('publisher', book.publisher)
            book.stock = data.get('stock', book.stock)
            
            db.session.commit()
            return jsonify({'message': 'Book updated successfully'})
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 400
            
    if request.method == 'DELETE':
        try:
            db.session.delete(book)
            db.session.commit()
            return jsonify({'message': 'Book deleted successfully'})
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 400