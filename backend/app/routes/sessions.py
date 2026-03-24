from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from ..models.session import Session, SessionUser
from ..models.user import db

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
        'created_at': session.created_at.isoformat()
    }), 200

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