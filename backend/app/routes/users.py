from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from ..models.user import User

users_bp = Blueprint('users', __name__)

@users_bp.route('/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    """Get user details by ID - used for displaying participant names in lobby"""
    user = User.query.get(user_id)

    if not user:
        return jsonify({'error': 'user not found'}), 404

    # Return user info (NOT password_hash for security)
    return jsonify({
        'user_id': user.user_id,
        'username': user.username,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'email': user.email,
        'dietary_restrictions': user.dietary_restrictions
    }), 200