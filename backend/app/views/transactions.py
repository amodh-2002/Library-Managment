from flask import Blueprint, jsonify, request, make_response
from datetime import datetime
from ..models import Transaction, Book, Member, db

bp = Blueprint('transactions', __name__, url_prefix='/api/transactions')

# Separate OPTIONS handler for each route pattern
@bp.route('/return/<int:transaction_id>', methods=['OPTIONS'])
def handle_return_options(transaction_id):
    response = make_response()
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'PUT, OPTIONS')
    return response

@bp.route('/issue', methods=['OPTIONS'])
def handle_issue_options():
    response = make_response()
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
    return response

@bp.route('/active', methods=['GET'])
def get_active_transactions():
    """Get all transactions where return_date is NULL"""
    try:
        active_transactions = Transaction.query.filter_by(return_date=None).all()
        return jsonify([{
            'id': t.id,
            'book': {
                'id': t.book.id,
                'title': t.book.title
            },
            'member': {
                'id': t.member.id,
                'name': t.member.name
            },
            'issue_date': t.issue_date.isoformat(),
        } for t in active_transactions])
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@bp.route('/issue', methods=['POST'])
def issue_book():
    try:
        data = request.get_json()
        book = Book.query.get_or_404(data['book_id'])
        member = Member.query.get_or_404(data['member_id'])
        
        if book.stock <= 0:
            return jsonify({'error': 'Book not available'}), 400
            
        if member.outstanding_debt >= 500:
            return jsonify({'error': 'Member has outstanding debt over Rs. 500'}), 400

        transaction = Transaction(
            book_id=book.id,
            member_id=member.id,
            issue_date=datetime.utcnow()
        )
        
        book.stock -= 1
        db.session.add(transaction)
        db.session.commit()
        
        return jsonify({'message': 'Book issued successfully'}), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@bp.route('/return/<int:transaction_id>', methods=['PUT'])
def return_book(transaction_id):
    try:
        transaction = Transaction.query.get_or_404(transaction_id)
        
        if transaction.return_date:
            return jsonify({'error': 'Book already returned'}), 400
            
        transaction.return_date = datetime.utcnow()
        transaction.book.stock += 1
        
        # Calculate rent (Rs. 10 per day)
        days = (transaction.return_date - transaction.issue_date).days
        transaction.rent_fee = max(days * 10, 0)
        transaction.member.outstanding_debt += transaction.rent_fee
        
        db.session.commit()
        return jsonify({
            'message': 'Book returned successfully',
            'rent_fee': transaction.rent_fee,
            'total_debt': transaction.member.outstanding_debt
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@bp.route('', methods=['OPTIONS'])
@bp.route('/issue', methods=['OPTIONS'])
@bp.route('/return/<int:transaction_id>', methods=['OPTIONS'])
def handle_options(transaction_id=None):
    response = make_response()
    response.headers.add('Access-Control-Allow-Origin', request.origin)  # Dynamic origin
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS')
    return response