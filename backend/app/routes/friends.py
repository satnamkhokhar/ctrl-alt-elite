from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import or_, and_
from ..models.user import db, User
from ..models.friendship import Friendship

friends_bp = Blueprint('friends', __name__)


@friends_bp.route('/request', methods=['POST'])
@jwt_required()
def send_friend_request():
    current_user_id = int(get_jwt_identity())
    data = request.get_json()
    receiver_id = data.get('receiver_id')

    if not receiver_id:
        return jsonify({'error': 'receiver_id required'}), 400

    if receiver_id == current_user_id:
        return jsonify({'error': 'cannot send friend request to yourself'}), 400

    receiver = User.query.get(receiver_id)
    if not receiver:
        return jsonify({'error': 'user not found'}), 404

    existing = Friendship.query.filter(
        or_(
            and_(Friendship.sender_id == current_user_id, Friendship.receiver_id == receiver_id),
            and_(Friendship.sender_id == receiver_id, Friendship.receiver_id == current_user_id)
        )
    ).first()

    if existing:
        if existing.status == 'accepted':
            return jsonify({'error': 'already friends'}), 409
        return jsonify({'error': 'friend request already exists'}), 409

    friendship = Friendship(sender_id=current_user_id, receiver_id=receiver_id, status='pending')
    db.session.add(friendship)
    db.session.commit()

    return jsonify({'message': 'friend request sent', 'friendship_id': friendship.friendship_id}), 201


@friends_bp.route('/accept/<int:friendship_id>', methods=['POST'])
@jwt_required()
def accept_friend_request(friendship_id):
    current_user_id = int(get_jwt_identity())

    friendship = Friendship.query.get(friendship_id)
    if not friendship:
        return jsonify({'error': 'friend request not found'}), 404

    if friendship.receiver_id != current_user_id:
        return jsonify({'error': 'not authorized'}), 403

    if friendship.status != 'pending':
        return jsonify({'error': 'friend request is not pending'}), 400

    friendship.status = 'accepted'
    db.session.commit()

    return jsonify({'message': 'friend request accepted'}), 200


@friends_bp.route('/decline/<int:friendship_id>', methods=['DELETE'])
@jwt_required()
def decline_friend_request(friendship_id):
    current_user_id = int(get_jwt_identity())

    friendship = Friendship.query.get(friendship_id)
    if not friendship:
        return jsonify({'error': 'friend request not found'}), 404

    if friendship.receiver_id != current_user_id:
        return jsonify({'error': 'not authorized'}), 403

    db.session.delete(friendship)
    db.session.commit()

    return jsonify({'message': 'friend request declined'}), 200


@friends_bp.route('/<int:friend_id>', methods=['DELETE'])
@jwt_required()
def unfriend(friend_id):
    current_user_id = int(get_jwt_identity())

    friendship = Friendship.query.filter(
        or_(
            and_(Friendship.sender_id == current_user_id, Friendship.receiver_id == friend_id),
            and_(Friendship.sender_id == friend_id, Friendship.receiver_id == current_user_id)
        ),
        Friendship.status == 'accepted'
    ).first()

    if not friendship:
        return jsonify({'error': 'friendship not found'}), 404

    db.session.delete(friendship)
    db.session.commit()

    return jsonify({'message': 'unfriended successfully'}), 200


@friends_bp.route('', methods=['GET'])
@jwt_required()
def get_friends():
    current_user_id = int(get_jwt_identity())

    friendships = Friendship.query.filter(
        or_(
            Friendship.sender_id == current_user_id,
            Friendship.receiver_id == current_user_id
        ),
        Friendship.status == 'accepted'
    ).all()

    friends = []
    for f in friendships:
        friend_id = f.receiver_id if f.sender_id == current_user_id else f.sender_id
        friend = User.query.get(friend_id)
        if friend:
            friends.append({
                'friendship_id': f.friendship_id,
                'user_id': friend.user_id,
                'username': friend.username,
                'first_name': friend.first_name,
                'last_name': friend.last_name
            })

    return jsonify(friends), 200


@friends_bp.route('/requests', methods=['GET'])
@jwt_required()
def get_friend_requests():
    current_user_id = int(get_jwt_identity())

    pending = Friendship.query.filter(
        Friendship.receiver_id == current_user_id,
        Friendship.status == 'pending'
    ).all()

    result = []
    for f in pending:
        sender = User.query.get(f.sender_id)
        if sender:
            result.append({
                'friendship_id': f.friendship_id,
                'user_id': sender.user_id,
                'username': sender.username,
                'first_name': sender.first_name,
                'last_name': sender.last_name,
                'created_at': f.created_at.isoformat() if f.created_at else None
            })

    return jsonify(result), 200


@friends_bp.route('/status/<int:user_id>', methods=['GET'])
@jwt_required()
def get_friendship_status(user_id):
    current_user_id = int(get_jwt_identity())

    friendship = Friendship.query.filter(
        or_(
            and_(Friendship.sender_id == current_user_id, Friendship.receiver_id == user_id),
            and_(Friendship.sender_id == user_id, Friendship.receiver_id == current_user_id)
        )
    ).first()

    if not friendship:
        return jsonify({'status': 'none'}), 200

    if friendship.status == 'accepted':
        return jsonify({'status': 'friends', 'friendship_id': friendship.friendship_id}), 200

    if friendship.sender_id == current_user_id:
        return jsonify({'status': 'request_sent', 'friendship_id': friendship.friendship_id}), 200

    return jsonify({'status': 'request_received', 'friendship_id': friendship.friendship_id}), 200
