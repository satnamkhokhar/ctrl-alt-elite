from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models.user import db
from ..models.vote import Vote
from ..models.session import Session, SessionUser
from ..models.restaurant import Restaurant

votes_bp = Blueprint('votes', __name__)

@votes_bp.route('', methods=['POST'])
@jwt_required()
def cast_vote():
    """
    POST /votes
    Body: { "session_id": 1, "restaurant_id": 5, "vote_value": 1 or -1 }
    Records a user's vote (+1 for YES, -1 for NO)
    """
    current_user_id = int(get_jwt_identity())
    data = request.get_json()

    session_id = data.get('session_id')
    restaurant_id = data.get('restaurant_id')
    vote_value = data.get('vote_value')

    # Validation
    if not all([session_id, restaurant_id, vote_value is not None]):
        return jsonify({'error': 'session_id, restaurant_id, and vote_value are required'}), 400

    if vote_value not in [1, -1]:
        return jsonify({'error': 'vote_value must be 1 (YES) or -1 (NO)'}), 400

    # Check if session exists
    session = db.session.get(Session, session_id)
    if not session:
        return jsonify({'error': 'session not found'}), 404

    # Check if user is in this session
    is_member = SessionUser.query.filter_by(
        session_id=session_id,
        user_id=current_user_id
    ).first()

    if not is_member:
        return jsonify({'error': 'you are not a member of this session'}), 403

    # Check if user already voted on this restaurant
    existing_vote = Vote.query.filter_by(
        session_id=session_id,
        user_id=current_user_id,
        restaurant_id=restaurant_id
    ).first()

    if existing_vote:
        # Update existing vote
        existing_vote.vote_value = vote_value
        db.session.commit()
        message = 'vote updated'
    else:
        # Create new vote
        new_vote = Vote(
            session_id=session_id,
            restaurant_id=restaurant_id,
            user_id=current_user_id,
            vote_value=vote_value
        )
        db.session.add(new_vote)
        db.session.commit()
        message = 'vote recorded'

    return jsonify({
        'message': message,
        'vote_value': vote_value
    }), 200

@votes_bp.route('/session/<int:session_id>', methods=['GET'])
@jwt_required()
def get_session_votes(session_id):
    """
    GET /votes/session/123
    Returns all votes for a session
    """
    current_user_id = int(get_jwt_identity())

    # Check if user is in session
    is_member = SessionUser.query.filter_by(
        session_id=session_id,
        user_id=current_user_id
    ).first()

    if not is_member:
        return jsonify({'error': 'you are not a member of this session'}), 403

    # Get all participants
    participants = SessionUser.query.filter_by(session_id=session_id).all()
    participant_count = len(participants)

    # Get all votes
    votes = Vote.query.filter_by(session_id=session_id).all()

    # Get unique restaurants that have been voted on
    voted_restaurant_ids = list(set([v.restaurant_id for v in votes]))

    # Count votes per user
    votes_per_user = {}
    for participant in participants:
        user_vote_count = Vote.query.filter_by(
            session_id=session_id,
            user_id=participant.user_id
        ).count()
        votes_per_user[participant.user_id] = user_vote_count

    # Check if all users have voted on all restaurants
    all_finished = all(count == len(voted_restaurant_ids) for count in votes_per_user.values()) if voted_restaurant_ids else False

    # Group votes by restaurant
    votes_by_restaurant = {}
    for vote in votes:
        rid = vote.restaurant_id
        if rid not in votes_by_restaurant:
            votes_by_restaurant[rid] = []
        votes_by_restaurant[rid].append({
            'user_id': vote.user_id,
            'vote_value': vote.vote_value,
            'created_at': vote.created_at.isoformat()
        })

    return jsonify({
        'session_id': session_id,
        'participant_count': participant_count,
        'votes': votes_by_restaurant,
        'finished': all_finished
    }), 200

@votes_bp.route('/session/<int:session_id>/tally', methods=['GET'])
@jwt_required()
def tally_votes(session_id):
    """
    GET /votes/session/123/tally
    Calculates total scores for each restaurant
    """
    current_user_id = int(get_jwt_identity())

    is_member = SessionUser.query.filter_by(
        session_id=session_id,
        user_id=current_user_id
    ).first()

    if not is_member:
        return jsonify({'error': 'you are not a member of this session'}), 403

    # Get all votes
    votes = Vote.query.filter_by(session_id=session_id).all()

    # Calculate scores
    scores = {}
    for vote in votes:
        rid = vote.restaurant_id
        if rid not in scores:
            scores[rid] = 0
        scores[rid] += int(vote.vote_value)

    # Get restaurant details for each scored restaurant
    tally_results = []
    for restaurant_id, score in scores.items():
        restaurant = db.session.get(Restaurant, restaurant_id)
        if restaurant:
            tally_results.append({
                'restaurant_id': restaurant_id,
                'restaurant_name': restaurant.name,
                'score': score
            })

    # Sort by score (highest first)
    tally_results.sort(key=lambda x: x['score'], reverse=True)

    return jsonify({
        'session_id': session_id,
        'tally': tally_results
    }), 200

@votes_bp.route('/session/<int:session_id>/finalize', methods=['POST'])
@jwt_required()
def finalize_session(session_id):
    """
    POST /votes/session/123/finalize
    Determines the winner (restaurant with highest score)
    """
    current_user_id = int(get_jwt_identity())

    is_member = SessionUser.query.filter_by(
        session_id=session_id,
        user_id=current_user_id
    ).first()

    if not is_member:
        return jsonify({'error': 'you are not a member of this session'}), 403

    # Get session
    session = db.session.get(Session, session_id)
    if not session:
        return jsonify({'error': 'session not found'}), 404

    # Check if already finalized
    if session.status == 'matched':
        restaurant = db.session.get(Restaurant, session.matched_restaurant_id)
        return jsonify({
            'message': 'session already finalized',
            'winning_restaurant_id': session.matched_restaurant_id,
            'winning_restaurant': {
                'restaurant_id': restaurant.restaurant_id,
                'name': restaurant.name,
                'formatted_address': restaurant.formatted_address,
                'cuisine': restaurant.cuisine,
                'latitude': restaurant.latitude,
                'longitude': restaurant.longitude
            } if restaurant else None
        }), 200

    # Get all votes
    votes = Vote.query.filter_by(session_id=session_id).all()

    if not votes:
        return jsonify({'error': 'no votes recorded yet'}), 400

    # Calculate scores
    scores = {}
    for vote in votes:
        rid = vote.restaurant_id
        if rid not in scores:
            scores[rid] = 0
        scores[rid] += int(vote.vote_value)

    # Find winner (highest score)
    if not scores:
        return jsonify({'error': 'no restaurants scored'}), 400

    winning_restaurant_id = max(scores, key=scores.get)
    winning_score = scores[winning_restaurant_id]

    # Update session
    session.matched_restaurant_id = winning_restaurant_id
    session.status = 'matched'
    db.session.commit()

    # Get restaurant details
    restaurant = db.session.get(Restaurant, winning_restaurant_id)

    return jsonify({
        'message': 'session finalized',
        'winning_restaurant_id': session.matched_restaurant_id,
        'winning_restaurant': {
            'restaurant_id': restaurant.restaurant_id,
            'name': restaurant.name,
            'formatted_address': restaurant.formatted_address,
            'cuisine': restaurant.cuisine,
            'latitude': restaurant.latitude,
            'longitude': restaurant.longitude,
            'phone_number': restaurant.phone_number
        } if restaurant else None
    }), 200

@votes_bp.route('/session/<int:session_id>/match', methods=['GET'])
@jwt_required()
def get_matched(session_id):
    """
    GET /votes/session/123/match
    Returns the matched restaurant if one exists
    """
    session = db.session.get(Session, session_id)

    if not session:
        return jsonify({'error': 'session not found'}), 404

    if not session.matched_restaurant_id:
        return jsonify({'message': 'no match found yet', 'match found': False}), 200

    restaurant = db.session.get(Restaurant, session.matched_restaurant_id)

    return jsonify({
        'match_found': True,
        'restaurant': {
            'restaurant_id': restaurant.restaurant_id,
            'name': restaurant.name,
            'formatted_address': restaurant.formatted_address,
            'cuisine': restaurant.cuisine,
            'latitude': restaurant.latitude,
            'longitude': restaurant.longitude,
            'phone_number': restaurant.phone_number
        } if restaurant else None
    }), 200
