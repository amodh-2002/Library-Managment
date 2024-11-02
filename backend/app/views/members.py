from flask import Blueprint, jsonify, request, make_response
from ..models import Member, db

bp = Blueprint('members', __name__, url_prefix='/api/members')

# Handle OPTIONS requests for all routes
@bp.route('', methods=['OPTIONS'])
@bp.route('/<int:member_id>', methods=['OPTIONS'])
def handle_options(member_id=None):
    response = make_response()
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    return response

@bp.route('', methods=['GET', 'POST'])
def members():
    if request.method == 'GET':
        members = Member.query.all()
        return jsonify([{
            'id': member.id,
            'name': member.name,
            'email': member.email,
            'outstanding_debt': member.outstanding_debt
        } for member in members])
    
    if request.method == 'POST':
        try:
            data = request.get_json()
            member = Member(
                name=data['name'],
                email=data['email'],
                outstanding_debt=0.0  # Initialize with zero debt
            )
            db.session.add(member)
            db.session.commit()
            return jsonify({'message': 'Member created successfully'}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 400

@bp.route('/<int:member_id>', methods=['PUT', 'DELETE'])
def member_operations(member_id):
    member = Member.query.get_or_404(member_id)
    
    if request.method == 'PUT':
        try:
            data = request.get_json()
            member.name = data.get('name', member.name)
            member.email = data.get('email', member.email)
            
            db.session.commit()
            return jsonify({'message': 'Member updated successfully'})
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 400
            
    if request.method == 'DELETE':
        try:
            # Check if member has outstanding debt
            if member.outstanding_debt > 0:
                return jsonify({
                    'error': f'Cannot delete member with outstanding debt of Rs. {member.outstanding_debt}'
                }), 400
                
            # Check if member has active transactions
            if any(not t.return_date for t in member.transactions):
                return jsonify({
                    'error': 'Cannot delete member with active book loans'
                }), 400
                
            db.session.delete(member)
            db.session.commit()
            return jsonify({'message': 'Member deleted successfully'})
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 400