from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models.user import db, User
from ..models.restaurant import Restaurant
from ..models.vote import Vote
import json

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

# GET me
@users_bp.route('/me', methods=['GET'])
@jwt_required()
def get_my_profile():
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)

    favorites = []
    if user.favorite_restaurants:
        try:
            fav_ids = json.loads(user.favorite_restaurants)
        except:
            fav_ids = user.favorite_restaurants.split(',')

        fav_restaurants = Restaurant.query.filter(
            Restaurant.restaurant_id.in_(fav_ids)
        ).all()

        for r in fav_restaurants:
            favorites.append({
                "restaurant_id": r.restaurant_id,
                "name": r.name,
                "cuisine": r.cuisine,
                "address": r.location
            })

    return jsonify({
        "user_id": user.user_id,
        "username": user.username,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "dietary_restrictions": user.dietary_restrictions,
        "favorite_restaurants": favorites
    }), 200

# GET search
@users_bp.route('/search', methods=['GET'])
@jwt_required()
def search_users():
    query = request.args.get('query', '')

    users = User.query.filter(
        (User.username.ilike(f"%{query}%")) |
        (User.first_name.ilike(f"%{query}%")) |
        (User.last_name.ilike(f"%{query}%"))
    ).all()

    return jsonify([
        {
            "user_id": u.user_id,
            "username": u.username,
            "first_name": u.first_name,
            "last_name": u.last_name
        }
        for u in users
    ]), 200

# GET profile
@users_bp.route('/<int:user_id>/profile', methods=['GET'])
@jwt_required()
def get_user_profile(user_id):
    user = User.query.get_or_404(user_id)

    favorites = []
    if user.favorite_restaurants:
        try:
            fav_ids = json.loads(user.favorite_restaurants)
        except:
            fav_ids = user.favorite_restaurants.split(',')

        fav_restaurants = Restaurant.query.filter(
            Restaurant.restaurant_id.in_(fav_ids)
        ).all()

        for r in fav_restaurants:
            favorites.append({
                "restaurant_id": r.restaurant_id,
                "name": r.name,
                "cuisine": r.cuisine,
                "address": r.location
            })

    recent_votes = (
        Vote.query
        .filter_by(user_id=user_id, vote_value=1)
        .order_by(Vote.created_at.desc())
        .limit(20)
        .all()
    )
    seen = set()
    recents = []
    for v in recent_votes:
        if v.restaurant_id not in seen:
            seen.add(v.restaurant_id)
            r = db.session.get(Restaurant, v.restaurant_id)
            if r:
                recents.append({
                    "restaurant_id": r.restaurant_id,
                    "name": r.name,
                    "cuisine": r.cuisine,
                })
        if len(recents) == 6:
            break

    return jsonify({
        "user_id": user.user_id,
        "username": user.username,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "favorite_restaurants": favorites,
        "recent_restaurants": recents,
    }), 200

# PUT dietary restrictions
@users_bp.route('/me/dietary-restrictions', methods=['PUT'])
@jwt_required()
def update_dietary_restrictions():
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    user.dietary_restrictions = data.get('dietary_restrictions', '')
    db.session.commit()
    return jsonify({"message": "Dietary restrictions updated", "dietary_restrictions": user.dietary_restrictions}), 200

# POST favorites
@users_bp.route('/me/favorites', methods=['POST'])
@jwt_required()
def add_favorite():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    restaurant_id = data.get('restaurant_id')

    if not restaurant_id:
        return jsonify({"error": "restaurant_id required"}), 400

    user = User.query.get_or_404(user_id)

    if user.favorite_restaurants:
        try:
            fav_ids = json.loads(user.favorite_restaurants)
        except:
            fav_ids = user.favorite_restaurants.split(',')
    else:
        fav_ids = []

    if restaurant_id not in fav_ids:
        fav_ids.append(restaurant_id)

    user.favorite_restaurants = json.dumps(fav_ids)
    db.session.commit()

    return jsonify({"message": "Restaurant added"}), 200

# DELETE favorites restaurant
@users_bp.route('/me/favorites/<int:restaurant_id>', methods=['DELETE'])
@jwt_required()
def remove_favorite(restaurant_id):
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)

    if user.favorite_restaurants:
        try:
            fav_ids = json.loads(user.favorite_restaurants)
        except:
            fav_ids = user.favorite_restaurants.split(',')
    else:
        fav_ids = []

    if restaurant_id in fav_ids:
        fav_ids.remove(restaurant_id)
        user.favorite_restaurants = json.dumps(fav_ids)
        db.session.commit()

    return jsonify({"message": "Restaurant removed"}), 200

