from flask import Blueprint, jsonify, request, make_response
from ..models import Book, db

bp = Blueprint('books', __name__, url_prefix='/api/books')

# Handle OPTIONS requests for all routes
@bp.route('', methods=['OPTIONS'])
@bp.route('/<int:book_id>', methods=['OPTIONS'])
@bp.route('/import', methods=['OPTIONS'])
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
            # Only check for active transactions
            active_transactions = [t for t in book.transactions if t.return_date is None]
            if active_transactions:
                return jsonify({
                    'error': 'Cannot delete book that is currently borrowed'
                }), 400
                
            db.session.delete(book)
            db.session.commit()
            return jsonify({'message': 'Book deleted successfully'})
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 400

@bp.route('/import', methods=['POST'])
def import_books():
    try:
        books_data = request.get_json()
        if not isinstance(books_data, list):
            books_data = [books_data]  # Convert single book to list
            
        imported_count = 0
        skipped_count = 0
        errors = []
        
        for book_data in books_data:
            try:
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
                else:
                    skipped_count += 1
            except Exception as e:
                errors.append(f"Error importing book {book_data.get('title', 'Unknown')}: {str(e)}")
                continue
        
        if imported_count > 0:
            try:
                db.session.commit()
            except Exception as e:
                db.session.rollback()
                return jsonify({'error': f"Database error: {str(e)}"}), 400
        
        message = f'Successfully imported {imported_count} books'
        if skipped_count > 0:
            message += f', skipped {skipped_count} existing books'
        if errors:
            message += f'. Errors: {"; ".join(errors)}'
            
        return jsonify({
            'message': message,
            'imported': imported_count,
            'skipped': skipped_count,
            'errors': errors
        }), 201 if imported_count > 0 else 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400