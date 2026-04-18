from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from ..models.session import Session, SessionUser
from ..models.session_restaurant import SessionRestaurant
from ..models.restaurant import Restaurant
from ..models.user import db, User

sessions_bp = Blueprint('sessions', __name__)

@sessions_bp.route('', methods=['POST'])
@jwt_required()
def create_session():
    current_user_id = get_jwt_identity() #pulls logged-in user's id out of the token
    data = request.get_json() #parses the JSON body sent in the request

    budget = data.get('budget') #grabs budget from the request body, None if missing
    max_distance = data.get('max_distance') #grabs max_distance from request body

    if budget is None or max_distance is None:
        return jsonify({'error': 'budget and max_distance are required'}), 400

    try:
        budget = float(budget)
        max_distance = float(max_distance)
    except (ValueError, TypeError):
        return jsonify({'error': 'budget and max_distance must be numbers'}), 400

    new_session = Session( #Creates a new session object
        budget=budget,
        max_distance=max_distance,
        active_users=1
    )

    db.session.add(new_session) #stages the new session to be saved
    db.session.flush()  #writes to DB temporarily so we can get the auto-genrated session id

    #automatically add the leader as the first member of the session they just created
    session_user = SessionUser(
        session_id=new_session.session_id, #session_id we just got from the flush()
        user_id=current_user_id #the logged-in user becomes the leader/first member
    )

    db.session.add(session_user) #stages session_user row to be saved
    db.session.commit() #now commits both the session and the session_user to the DB together

    return jsonify({
        'message': 'session created successfully',
        'session_id': new_session.session_id, #returns session_id so the leader can share it with others
        'budget': float(new_session.budget),
        'max_distance': float(new_session.max_distance),
        'active_users': new_session.active_users
    }), 201

@sessions_bp.route('/<int:session_id>', methods=['GET'])
@jwt_required()
def get_session(session_id):
    session = db.session.get(Session, session_id) # looks up session id by primary key
    
    if not session:
        return jsonify({'error': 'session not found.'}), 404

    members = SessionUser.query.filter_by(session_id=session_id).all()
    user_ids = [m.user_id for m in members]
    
    return jsonify({
        'session_id': session.session_id,
        'budget': float(session.budget),
        'max_distance': float(session.max_distance),
        'active_users': session.active_users,
        'members': user_ids,
        'status': session.status,
        'created_at': session.created_at.isoformat()
    }), 200

@sessions_bp.route('/<int:session_id>/start', methods=['POST'])
@jwt_required()
def start_session(session_id):
    session = db.session.get(Session, session_id)
    if not session:
        return jsonify({'error': 'session not found'}), 404

    session.status = 'started'
    db.session.commit()

    # Return aggregated dietary restrictions from all members
    members = SessionUser.query.filter_by(session_id=session_id).all()
    all_restrictions = []
    for member in members:
        user = db.session.get(User, member.user_id)
        if user and user.dietary_restrictions:
            all_restrictions.extend(user.dietary_restrictions.lower().split(','))

    dietary = None
    if 'vegan' in all_restrictions:
        dietary = 'vegan'
    elif 'vegetarian' in all_restrictions:
        dietary = 'vegetarian'

    return jsonify({'message': 'session started', 'dietary': dietary}), 200

@sessions_bp.route('/<int:session_id>/join', methods=['POST'])
@jwt_required()
def join_session(session_id):
    current_user_id = get_jwt_identity()
    
    session = db.session.get(Session, session_id)
    if not session:
        return jsonify({'error': 'session not found.'}), 404
    
    already_joined = SessionUser.query.filter_by(
        session_id=session_id,
        user_id=current_user_id
    ).first()
    
    if already_joined:
        return jsonify({'error: User has already joined.'})
    
    new_member = SessionUser(
        session_id=session_id,
        user_id=current_user_id
    )
    db.session.add(new_member)
    
    session.active_users += 1
    db.session.commit()
    
    return jsonify({
        'message': 'successfully joined the session',
        'session_id': session_id
    }), 200

@sessions_bp.route('/<int:session_id>/restaurants', methods=['POST'])
@jwt_required()
def store_session_restaurants(session_id):
    """Host calls this after fetching restaurants to lock in the shared list."""
    session = db.session.get(Session, session_id)
    if not session:
        return jsonify({'error': 'session not found'}), 404

    data = request.get_json()
    restaurant_ids = data.get('restaurant_ids', [])

    # Clear any previous list (in case host refreshes)
    SessionRestaurant.query.filter_by(session_id=session_id).delete()

    for position, rid in enumerate(restaurant_ids):
        db.session.add(SessionRestaurant(
            session_id=session_id,
            restaurant_id=rid,
            position=position
        ))

    db.session.commit()
    return jsonify({'message': 'restaurants stored', 'count': len(restaurant_ids)}), 200


@sessions_bp.route('/<int:session_id>/restaurants', methods=['GET'])
@jwt_required()
def get_session_restaurants(session_id):
    """All users call this to get the same shared restaurant list."""
    session = db.session.get(Session, session_id)
    if not session:
        return jsonify({'error': 'session not found'}), 404

    rows = SessionRestaurant.query.filter_by(session_id=session_id).order_by(SessionRestaurant.position).all()

    if not rows:
        return jsonify({'ready': False, 'restaurants': []}), 200

    ids = [r.restaurant_id for r in rows]
    id_to_rest = {r.restaurant_id: r for r in Restaurant.query.filter(Restaurant.restaurant_id.in_(ids)).all()}

    restaurants = []
    for rid in ids:
        r = id_to_rest.get(rid)
        if r:
            restaurants.append({
                'restaurant_id': r.restaurant_id,
                'name': r.name,
                'cuisine': r.cuisine,
                'formatted_address': r.formatted_address,
                'latitude': float(r.latitude) if r.latitude else None,
                'longitude': float(r.longitude) if r.longitude else None,
            })

    return jsonify({'ready': True, 'restaurants': restaurants}), 200


@sessions_bp.route('/create-with-group', methods=['POST'])
@jwt_required()
def create_session_with_group():
    user_id = int(get_jwt_identity())
    data = request.get_json()

    group_id = data.get("group_id")

    if not group_id:
        return jsonify({"error": "group_id required"}), 400

    members = SavedGroupMember.query.filter_by(group_id=group_id).all()

    if not members:
        return jsonify({"error": "Group has no members"}), 400

    new_session = Session(created_by=user_id)
    db.session.add(new_session)
    db.session.commit()

    for m in members:
        db.session.add(SessionUser(
            session_id=new_session.session_id,
            user_id=m.user_id
        ))

    db.session.commit()

    return jsonify({
        "message": "Session created from group",
        "session_id": new_session.session_id
    }), 201
